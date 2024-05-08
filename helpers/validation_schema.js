const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    fullname : Joi.string().required(),
    nim : Joi.string().required(),
    password : Joi.string().min(8).required()
});

module.exports = authSchema;