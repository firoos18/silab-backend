const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  fullname: Joi.string().required(),
  nim: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().min(8).required(),
  repeat_password: Joi.ref("password"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const subjectSchema = Joi.object({
  name: Joi.string().required(),
  acronyms: Joi.string().lowercase().required(),
  lecturer: Joi.string().required(),
  classes: Joi.any(),
});

module.exports = { registerSchema, loginSchema, subjectSchema };
