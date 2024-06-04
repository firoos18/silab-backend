const Subject = require("../models/Subject.model");
const { subjectSchema } = require("../helpers/validation_schema");
const createError = require("http-errors");

async function getAllSubjects(req, res, next) {
  try {
    const subjects = await Subject.find().populate("classes");

    const response = {
      status: 200,
      message: "success",
      data: subjects,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getSubject(req, res, next) {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id).populate("classes");

    const response = {
      status: 200,
      message: "success",
      data: subject,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function addSubject(req, res, next) {
  try {
    const result = await subjectSchema.validateAsync(req.body);
    const doesExist = await Subject.findOne({ name: result.name });
    if (doesExist)
      throw createError.Conflict(`${result.name} is already added`);

    const subject = new Subject(result);
    const savedSubject = await subject.save();

    const response = {
      status: 201,
      message: `${savedSubject.name} added.`,
    };

    res.send(response);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

async function updateSubject(req, res, next) {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const data = req.body;

    const subject = await Subject.findOneAndUpdate(
      filter,
      { $set: data },
      {
        returnOriginal: false,
      }
    );
    if (!subject) throw createError.NotFound("Subject not Found");

    const response = {
      status: 201,
      message: "updated",
      data: subject,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function deleteSubject(req, res, next) {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) throw createError.NotFound("Subject not found");

    await Subject.deleteOne({ _id: id });

    const response = {
      status: 200,
      message: "deleted",
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllSubjects,
  addSubject,
  getSubject,
  updateSubject,
  deleteSubject,
};
