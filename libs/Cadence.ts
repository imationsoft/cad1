import cadenceContextValidator from '../schema/cadenceValidator';
import { triggerPayloadValidator } from './../schema/triggerPayload'
import { withTransaction, makeDb, validateNumber, validateContact, formatNumber } from '../utils/utils';
import config from './../config';

import { CadenceProcessing } from './CadenceProcessing'
import { CadenceActionProcessing } from './CadenceActionProcessing'

class Cadence {

    addCadence = async (context: any) => {
        try {
            await cadenceContextValidator(context);

            const cadenceObject: ICadence = {
                businessId: context.businessId,
                status: context.status,
                cadenceName: context.cadenceName,
                lastUpdate: context.lastUpdate,
                eventUrl: context.eventUrl,
                checkDnc: context.checkDnc,
                reEnrollment: context.reEnrollment,
                useContactOwner: context.useContactOwner,
                autoAssignOwner: context.autoAssignOwner,
                version: context.version,
                queueid: context.queueid,
                cadenceHours: context.cadenceHours,
                targetHours: context.targetHours,
                cadenceActions: context.cadenceActions,
                cadenceDispositionRules: context.cadenceDispositionRules,
                cadenceHarrassmentPolicies: context.cadenceHarrassmentPolicies,
            };

            const db = await makeDb(config.db);
            let cadenceId: number;
            await withTransaction(db, async () => {
              await db.query('SET autocommit=0;', []);
              const cadenceUpsertResult = await this.upsertCadence(db, cadenceObject);
              cadenceId = cadenceUpsertResult[0][0].cadenceId;

                for await (const action of context.cadenceActions) {
                    const cadenceAction: ICadenceAction = {
                        cadenceId,
                        ...action,
                    };
                    await this.upsertCadenceAction(db, cadenceAction);
                }

                for await (const policy of context.cadenceHarrassmentPolicies) {
                    const addCadenceHarrassmentPolicy: ICadenceHarrasmentPolicy = {
                        ...policy,
                        cadenceId,
                    };

                    await this.upsertCadenceHarrassmentPolicy(
                        db,
                        addCadenceHarrassmentPolicy
                    );
                }

                for await (const rule of context.cadenceDispositionRules) {
                    const cadenceDispositionRule: ICadenceDispositionRule = {
                        cadenceId,
                        ...rule,
                    };

                    await this.upsertCadenceDispositionRule(
                        db,
                        cadenceDispositionRule
                    );
                }
                await db.query('SET autocommit=1;', []);
            });

            return {
                success: true,
                cadenceId,
            };
        } catch (e) {
            throw e;
        }
    };

    upsertCadence = async (db: any, cadence: ICadence) => {
      const cadenceResult = await db.query('call upsertCadence(?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [
              cadence.cadenceId || '',
              cadence.businessId,
              cadence.status,
              cadence.cadenceName,
              cadence.lastUpdate,
              cadence.eventUrl,
              cadence.checkDnc,
              cadence.reEnrollment,
              cadence.useContactOwner,
              cadence.autoAssignOwner,
              cadence.version,
              cadence.queueid,
              JSON.stringify(cadence.cadenceHours),
              JSON.stringify(cadence.targetHours),
          ]
      );
      
    return cadenceResult;

    }

    upsertCadenceAction = async (db: any, cadenceAction: ICadenceAction) => {
        const upsertCadenceActionResult = await db.query('call upsertCadenceAction(?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [
          cadenceAction.cadenceActionId|| '',
          cadenceAction.cadenceId,
          cadenceAction.status,
          cadenceAction.actionIndex,
          cadenceAction.type,
          cadenceAction.durationFromLastAction,
          cadenceAction.durationGrouping,
          cadenceAction.calculatedDuration,
          cadenceAction.retryCall,
          cadenceAction.maxRetries,
          cadenceAction.callRetryIn,
          cadenceAction.retryGrouping,
          cadenceAction.smsTemplatedId,
          cadenceAction.smsMessage,
      ]);

      return upsertCadenceActionResult;

    }

    upsertCadenceHarrassmentPolicy = async (
        db: any,
        cadenceHarrassmentPolicy: ICadenceHarrasmentPolicy
    ) => {

        const upsertCadenceHarrassmentPolicyResult = await db.query('call upsertCadenceHarrassmentPolicy(?,?,?,?,?,?,?);', [
            cadenceHarrassmentPolicy.cadenceHarrassmentPolicyId || '',  
            cadenceHarrassmentPolicy.channel,
            cadenceHarrassmentPolicy.frequency,
            cadenceHarrassmentPolicy.durationCount,
            cadenceHarrassmentPolicy.durationGrouping,
            cadenceHarrassmentPolicy.calculatedDuration,
            cadenceHarrassmentPolicy.cadenceId,
        ]);

        return upsertCadenceHarrassmentPolicyResult;

      }

    upsertCadenceDispositionRule = async (
        db: any,
        cadenceDispositionRule: ICadenceDispositionRule
    ) => {

        const upsertCadenceDispostionRuleResult = await db.query('call upsertCadenceDispositionRule(?,?,?,?,?);', [
            cadenceDispositionRule.cadenceDispositionRuleId || '',  
            cadenceDispositionRule.cadenceId,
            cadenceDispositionRule.dispositionId,
            cadenceDispositionRule.action,
            cadenceDispositionRule.targetCadence,
        ]);

        return upsertCadenceDispostionRuleResult;

    };

    getCadencesByBusinessId = async (db: any, businessId: number) => {
        const cadences = await db.query('call getBusinessCadences(?);', [
            businessId,
        ]);
        return cadences;
    };

    getCadenceById = async (cadenceId: number) => {
        const db = await makeDb(config.db);
        const cadenceResult = await db.query('call getCadenceById(?);', [cadenceId]);
        if(!cadenceResult[0][0]) {
            throw new Error('Invalid Cadence ID');
        }

        const cadence = cadenceResult[0][0];
        cadence.cadenceHours = JSON.parse(cadence.cadenceHours);
        cadence.targetHours = JSON.parse(cadence.targetHours);

        const cadenceActions = await db.query(
            'call getCadenceActionsById(?);',
            [cadenceId]
        );

        const cadenceHarrassmentPolicies = await db.query(
            'call getCadenceHarrassmentPolcies(?);',
            [cadenceId]
        );

        const cadenceDispositionRules = await db.query(
            'call getcadenceDispositionRules(?);',
            [cadenceId]
        );

        const cadenceValues = {
            ...cadence,
            cadenceActions: cadenceActions[0],
            cadenceHarrassmentPolicies: cadenceHarrassmentPolicies[0],
            cadenceDispositionRules: cadenceDispositionRules[0],
        };

        return cadenceValues;
    };

    updateCadence = async (context: any) => {
        try {
            await cadenceContextValidator(context);

            const cadenceObject: ICadence = {
                cadenceId: context.cadenceId,
                businessId: context.businessId,
                status: context.status,
                cadenceName: context.cadenceName,
                lastUpdate: context.lastUpdate,
                eventUrl: context.eventUrl,
                checkDnc: context.checkDnc,
                reEnrollment: context.reEnrollment,
                useContactOwner: context.useContactOwner,
                autoAssignOwner: context.autoAssignOwner,
                version: context.version,
                queueid: context.queueid,
                cadenceHours: context.cadenceHours,
                targetHours: context.targetHours,
                cadenceActions: context.cadenceActions,
                cadenceDispositionRules: context.cadenceDispositionRules,
                cadenceHarrassmentPolicies: context.cadenceHarrassmentPolicies,
            };

            const db = await makeDb(config.db);

            await withTransaction(db, async () => {

              const cadenceUpsertResult = await this.upsertCadence(db, cadenceObject);

                for await (const action of context.cadenceActions) {
                    const cadenceAction: ICadenceAction = {
                        ...action,
                    };
                    await this.upsertCadenceAction(db, cadenceAction);
                }

                for await (const policy of context.cadenceHarrassmentPolicies) {
                    const addCadenceHarrassmentPolicy: ICadenceHarrasmentPolicy = {
                        ...policy,
                    };

                    await this.upsertCadenceHarrassmentPolicy(
                        db,
                        addCadenceHarrassmentPolicy
                    );
                }

                for await (const rule of context.cadenceDispositionRules) {
                    const cadenceDispositionRule: ICadenceDispositionRule = {
                        ...rule,
                    };

                    await this.upsertCadenceDispositionRule(
                        db,
                        cadenceDispositionRule
                    );
                }
                await db.query('SET autocommit=1;', []);
            });

            return {
                success: true,
            };
        } catch (e) {
            console.log(e.stack);
            throw e;
        }
    };

    processTrigger = async (body:Array<ItriggerPayload>) => {

        
        for(const triggerPayload of body) {
            

        const cadenceValidated = await this.validateCadence(triggerPayload)
        if (!cadenceValidated) {
            throw new Error('Failed to validate cadence')
        }

        const { cadenceId, phoneNumber } = triggerPayload

        const validatedContact = await validateContact(triggerPayload.phoneNumber)
        console.log(validatedContact);
        //TODO :: Talk to ben on how to log errors from the above and below validation functions.
        const validatedNumber = await validateNumber(triggerPayload.phoneNumber, validatedContact.contact.countryCode );

        const formattedNumber = await formatNumber(validatedNumber, "PNF.E164");

        const cadence = await this.getCadenceById(triggerPayload.cadenceId);

        const cadenceProcessingObj = new CadenceProcessing()

        const cadenceProcessing: any = await cadenceProcessingObj.fetchWithTargetNumber(cadenceId, formattedNumber)

        const cadenceActionProcessing = new CadenceActionProcessing()

        if (cadenceProcessing.length !== 0) {
            if (cadence.reEnrollment === 1) {
                    await cadenceProcessingObj.updateCadenceProcessing('status = "completed", substatus = "DueToRenrollment"', '"processing"', cadenceProcessing[0].cadenceProcessId)
                    await cadenceActionProcessing.markStatus(cadenceProcessing[0].cadenceProcessId, '"processing"', '"completed"', '"DueToRenrollment"')
            }
            else {
                throw 'CADENCE_RE-ENROLLMENT OFF'
            }
        }

        const res = await cadenceProcessingObj.createCadenceProcessing({
            cadenceId: cadence.cadenceId,
            businessId: cadence.businessId,
            userId: validatedContact.contact.userId || 'NULL',
            cadenceVersion: cadence.version,
            targetPhoneNumber: formattedNumber,
            status: "processing",
        });
        const cadenceAction = cadence.cadenceActions[0]
        const createCadenceActionProcessingResult = await cadenceActionProcessing.createCadenceActionProcess({
            cadenceProcessId: res.insertId,
            cadenceActionId: cadenceAction.cadenceActionId,
            businessid: cadence.businessId,
            actionIndex: cadenceAction.actionIndex,
            type: cadenceAction.type,
            calculatedDuration: cadenceAction.calculatedDuration,
            retryCall: cadenceAction.retryCall,
            maxRetries: cadenceAction.maxRetries,
            callRetryIn: cadenceAction.callRetryIn,
            retryGrouping: cadenceAction.retryGrouping,
            smsTemplatedId: cadenceAction.smsTemplatedId,
            smsMessage: cadenceAction.smsMessage,
            scheduledDate: `"${new Date()}"`,
            status: "scheduled"
        });
        
        }

        

        return {success:true}
    };

    validateCadence = async (triggerPayload: ItriggerPayload) => {
        const { cadenceId, businessId, isValidated } = triggerPayload
        if (isValidated) {
            return true
        }
        await triggerPayloadValidator.validateAsync(triggerPayload)
        const db = await makeDb(config.db);
        //TODO:: convert to param and move to store proc
        const query = 
        `
        SELECT c.cadenceId, c.businessId
        FROM calls.Cadence as c
        LEFT JOIN calls.business as b
        ON c.businessId = b.businessid
        WHERE c.cadenceId = ${cadenceId} AND b.businessid = ${businessId} AND c.status = "active" AND b.isactive = 1;`
        const result = await db.query(query, []);
        if (result.length === 0) {
            return false
        }
        return true
    };
}

export { Cadence };
