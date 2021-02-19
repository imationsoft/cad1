import * as Joi from 'joi';

const triggerPayloadValidator:any = Joi.object()
.keys({
    type: Joi.string().required(),
    cadenceId: Joi.number().required(),
    businessId: Joi.number().required(),
    apikey: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    startTimeStampUTC: Joi.string().required(),
    isValidated: Joi.boolean().required()
})

export { triggerPayloadValidator }