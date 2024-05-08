const createError = require("http-errors");
const User = require("../models/User.model");
const { registerSchema, loginSchema } = require("../helpers/validation_schema");
const { signAccessToken } = require("../helpers/jwt_helper");

async function register(req, res, next) {
  try {
    const result = await registerSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already been registered.`);

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);

    res.send({
      fullname: savedUser.fullname,
      nim: savedUser.nim,
      token: accessToken,
      message: "User Registered Successfully",
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginSchema.validateAsync(req.body);
    console.log(result.password);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User not registered");

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createError.Unauthorized("Either Email / Password is Incorrect");

    const accessToken = await signAccessToken(user.id);

    res.send({
      fullname: user.fullname,
      nim: user.nim,
      token: accessToken,
    });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Email / Password"));

    next(error);
  }
}

module.exports = {
  register,
  login,
};
