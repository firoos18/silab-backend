const SelectedSubject = require("../models/SelectedSubject.model");
const createError = require("http-errors");
const User = require("../models/User.model");
const Subject = require("../models/Subject.model");

async function getAllSelectedSubjects(req, res, next) {
  try {
    const selectedSubject = await SelectedSubject.find()
      .populate("userId")
      .populate("subjects");

    const response = {
      status: 200,
      message: "success",
      data: selectedSubject,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getSelectedSubjectById(req, res, next) {
  try {
    const { id } = req.params;

    const selectedSubject = await SelectedSubject.findById(id)
      .populate("userId")
      .populate("subjects");
    if (!selectedSubject) throw createError.NotFound();

    const response = {
      status: 200,
      message: success,
      data: selectedSubject,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function addSelectedSubject(req, res, next) {
  try {
    const { userId, subjects } = req.body;

    const user = await User.findById(userId);
    if (!user) throw createError.NotFound("User not found.");

    const doesUserExist = await SelectedSubject.findOne({ userId: user.id });
    if (doesUserExist)
      throw createError.Conflict("User already added subjects");

    for (let index = 0; index < subjects.length; index++) {
      const doesSubjectExist = await Subject.findById(subjects[index]);
      if (!doesSubjectExist) throw createError.NotFound("Subject not found");
    }

    const selectedSubject = new SelectedSubject({ userId, subjects });
    await selectedSubject.save();

    const response = {
      status: 200,
      message: "success",
      data: selectedSubject,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function updateSelectedSubject(req, res, next) {
  try {
    const { userId, subjects } = req.body;

    const user = await User.findById(userId);
    if (!user) throw createError.NotFound("User not found.");

    for (let index = 0; index < subjects.length; index++) {
      const doesSubjectExist = await Subject.findById(subjects[index]);
      if (!doesSubjectExist) throw createError.NotFound("Subject not found");
    }

    const newSelectedSubject = await SelectedSubject.findOneAndUpdate(
      { userId: user.id },
      { $set: { subjects: subjects } },
      {
        returnOriginal: false,
      }
    );

    const response = {
      status: 200,
      message: "updated",
      data: newSelectedSubject,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllSelectedSubjects,
  getSelectedSubjectById,
  addSelectedSubject,
  updateSelectedSubject,
};
