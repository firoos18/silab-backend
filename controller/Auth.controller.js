const createError = require("http-errors");
const User = require("../models/User.model");
const { registerSchema, loginSchema } = require("../helpers/validation_schema");
const { signAccessToken } = require("../helpers/jwt_helper");
const bcrypt = require("bcrypt");
const Otp = require("../models/Otp.model");
const mailSender = require("../helpers/email_transporter");

async function register(req, res, next) {
  try {
    const result = await registerSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already been registered.`);

    const user = new User(result);
    await user.save().then((result) => {
      sendOtpVerificationEmail(result, res, next);
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User not registered");

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createError.Unauthorized("Either Email / Password is Incorrect");

    const accessToken = await signAccessToken(user.id);

    const response = {
      status: 200,
      message: "success",
      data: {
        email: user.email,
        token: accessToken,
      },
    };

    res.send(response);
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Email / Password"));

    next(error);
  }
}

async function sendOtpVerificationEmail({ _id, email }, res, next) {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const newOtp = new Otp({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000,
    });
    await newOtp.save();

    await mailSender(
      email,
      "Email Verification",
      `<p> Enter OTP Code below to verify your email address </p> <br/>
    <p><b>${otp}<b></p>
  `
    );

    const response = {
      status: 200,
      message: "Verification OTP email sent",
      data: {
        userId: _id,
        email: email,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function resendOtpVerificationEmail(req, res, next) {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) throw createError.Conflict("Empty user details");

    await Otp.deleteMany({ userId });
    sendOtpVerificationEmail({ _id: userId, email }, res, next);
  } catch (error) {
    next(error);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      throw createError.Conflict("Empty OTP details");
    } else {
      const userOtp = await Otp.findOne({ userId });
      if (!userOtp) createError.NotFound("User OTP Not Found");

      const expiresAt = userOtp.expiresAt;
      const hashedOtp = userOtp.otp;

      if (expiresAt < Date.now()) {
        await Otp.deleteMany({ userId });
        throw createError.NotFound(
          "OTP Code has expired, please request for a new one"
        );
      } else {
        const validOtp = await bcrypt.compare(otp, hashedOtp);

        if (!validOtp) throw createError.Conflict("Invalid OTP Code");

        await User.updateOne({ _id: userId }, { verified: true });
        await Otp.deleteMany({ userId });

        res.json({
          status: 200,
          message: "User verified",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtpVerificationEmail,
};
