const User = require("../models/User.model");
const createError = require("http-errors");

async function getAllUsers(req, res, next) {
  try {
    const { role } = req.query;

    if (role) {
      const users = await User.find({ role: role }).exec();
      const response = {
        status: 200,
        message: "success",
        data: users,
      };
      res.send(response);
    }

    const users = await User.find().exec();
    const response = {
      status: 200,
      message: "success",
      data: users,
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getUserByNim(req, res, next) {
  try {
    const { nim } = req.params;
    const user = await User.findOne({ nim: nim }).exec();

    if (!user) throw createError.NotFound();

    const response = {
      status: 200,
      message: "success",
      data: user,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserByNim,
};
