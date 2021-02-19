import * as Joi from 'joi';

export default async function validateCadenceContext(cadence:any) {
    const targetHours = Joi.object()
    .keys({
        cadenceHoursId: Joi.number(),
        cadenceId: Joi.number(),
        dayOfWeek: Joi.number().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required()
    })
    .unknown(true);
    
    const cadenceHours = Joi.object()
    .keys({
        cadenceHoursId: Joi.number(),
        cadenceId: Joi.number(),
        dayOfWeek: Joi.number().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required()
    })
    .unknown(true);
    
    const cadenceActions = Joi.object()
    .keys({
            cadenceId: Joi.number(),
            cadenceActionId: Joi.number(),
            status: Joi.string().required(),
            actionIndex: Joi.number().required(),
            type: Joi.string().required(),
            durationFromLastAction:  Joi.number().required(),
            durationGrouping:  Joi.string().required(),
            calculatedDuration: Joi.number().required(),
            retryCall: Joi.number().required(),
            maxRetries: Joi.number().required(),
            callRetryIn: Joi.number().required(),
            retryGrouping: Joi.string().required(),
            smsTemplatedId: Joi.number().optional(),
            smsMessage: Joi.string().allow(null),
        
    })
    .unknown(true);

    const cadenceHarrassmentPolicies:any = Joi.object()
    .keys(
        {
            cadenceHarrassmentPolicyId: Joi.number().optional(),
            channel: Joi.string().required(),
            frequency: Joi.number(),
            durationCount: Joi.number(),
            durationGrouping: Date,
            calculatedDuration: Joi.number(),
            cadenceId: Joi.number()
        });


        const cadenceDispositionRules:any = Joi.object()
        .keys(
        {
            cadenceDispositionRuleId: Joi.number(),
            dispositionId: Joi.number(),
            cadenceId: Joi.number(),
            action: Joi.string().required(),
            targetCadence: Joi.number()
        });

    const cadenceSchema:any = Joi.object()
    .keys({
        cadenceId: Joi.number(),
        businessId: Joi.number().required(),
        status: Joi.string().required(),
        cadenceName: Joi.string().required(),
        eventUrl: Joi.string().required(),
        checkDnc: Joi.number().required(),
        reEnrollment: Joi.number().required(),
        useContactOwner: Joi.number().required(),
        autoAssignOwner: Joi.number().required(),
        version: Joi.number().required(),
        queueid: Joi.number().required(),
        cadenceActions: Joi.array().items(cadenceActions),
        cadenceHours: Joi.array().items(cadenceHours),
        targetHours: Joi.array().items(targetHours),
        cadenceHarrassmentPolicies: Joi.array().items(cadenceHarrassmentPolicies),
        cadenceDispositionRules: Joi.array().items(cadenceDispositionRules),

    })
    .unknown(true);



    await cadenceSchema.validateAsync(cadence);
    
}


