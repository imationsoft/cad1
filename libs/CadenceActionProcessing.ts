import config from '../config';
import { makeDb } from '../utils/utils';

class CadenceActionProcessing {

    fetchCadenceActionProcessing = async (
        cadenceProcessId:       Number | String, 
        cadenceActionProcessId: Number | String, 
        cadenceActionId:        Number | String,
        businessid:             Number | String,
    ) => {
        const query = `
        SELECT *
        FROM calls.CadenceActionProcessing as c
        WHERE c.cadenceProcessId        =   ${cadenceProcessId}
        AND   c.cadenceActionProcessId  =   ${cadenceActionProcessId}
        AND   c.cadenceActionId         =   ${cadenceActionId}
        AND   c.businessid              =   ${businessid}
        `
        const db = await makeDb(config.db);
        const result = await db.query(query, []);
        return result
    };

    markStatus = async (
        cadenceProcessId: String | Number, 
        status:           String, 
        newStatus:        String,
        substatus:        String
        ) => {

            try {

                const query = `
                UPDATE calls.CadenceActionProcessing
                SET   status = ${newStatus}, substatus = ${substatus}
                WHERE cadenceProcessId  = ${cadenceProcessId}
                AND   status = ${status}
            `
            const db = await makeDb(config.db);
            const result = await db.query(query, []);
            return result


            } catch (e) {

                throw(e)

            }


       
    };

    createCadenceActionProcess = async (values: any) => {
        const query = `
            INSERT INTO calls.CadenceActionProcessing (cadenceProcessId, cadenceActionId, businessid, actionIndex, type, calculatedDuration, retryCall, maxRetries, callRetryIn, retryGrouping, smsTemplatedId, smsMessage, scheduledDate, completedDate, attempts, status, delayReasons, substatus)
            VALUES (${values.cadenceProcessId}, ${values.cadenceActionId}, ${values.businessid}, ${values.actionIndex}, "${values.type}", ${values.calculatedDuration}, ${values.retryCall}, ${values.maxRetries}, ${values.callRetryIn}, "${values.retryGrouping}", ${values.smsTemplatedId}, "${values.smsMessage}", ${values.scheduledDate}, NULL, NULL, "Processing", NULL, NULL)
        `
        console.log("QUERY", query)
        const db = await makeDb(config.db);
        const result = await db.query(query, []);
        return result
    }
}

export { CadenceActionProcessing }