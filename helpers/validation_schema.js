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
  lecturer: Joi.string().required(),
  classes: Joi.any(),
});

const classSchema = Joi.object({
  subject: Joi.string().required(),
  name: Joi.string().required(),
  day: Joi.string().required(),
  startAt: Joi.string().required(),
  endAt: Joi.string().required(),
  assistants: Joi.any(),
  quota: Joi.number().required(),
  isFull: Joi.boolean(),
  participants: Joi.any(),
  learningModule: Joi.any(),
});

module.exports = { registerSchema, loginSchema, subjectSchema, classSchema };
