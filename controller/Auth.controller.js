const createError = require('http-errors');
const User = require('../models/User.model');
const { authSchema } = require('../helpers/validation_schema')