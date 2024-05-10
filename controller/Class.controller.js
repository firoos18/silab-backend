const createError = require("http-errors");
const Class = require("../models/Class.model");
const { classSchema } = require("../helpers/validation_schema");
const Subject = require("../models/Subject.model");
const User = require("../models/User.model");

async function getAllClasses(req, res, next) {
  try {
    const classes = await Class.find();

    const response = {
      status: 200,
      message: "success",
      data: {
        classes: classes.map((classRoom) => ({
          subject: classRoom.subject,
          name: classRoom.name,
          day: classRoom.day,
          startAt: classRoom.startAt,
          endAt: classRoom.endAt,
          assistants: classRoom.assistants,
          quota: classRoom.quota,
          isFull: classRoom.isFull,
          participants: classRoom.participants,
          learningModule: classRoom.learningModule,
        })),
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getClass(req, res, next) {
  try {
    const { id } = req.params;

    const classRoom = await Class.findById(id);
    if (!classRoom) throw createError.NotFound("Class Not Found.");

    const response = {
      status: 200,
      message: "success",
      data: {
        name: classRoom.name,
        day: classRoom.day,
        startAt: classRoom.startAt,
        endAt: classRoom.endAt,
        assistants: classRoom.assistants,
        quota: classRoom.quota,
        isFull: classRoom.isFull,
        participants: classRoom.participants,
        learningModule: classRoom.learningModule,
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function addClass(req, res, next) {
  try {
    const result = await classSchema.validateAsync(req.body);

    const classRoom = new Class(result);
    const savedClassRoom = await classRoom.save();

    const filter = { name: result.subject };

    const subjectRelated = await Subject.findOneAndUpdate(
      filter,
      {
        $push: {
          classes: {
            _id: savedClassRoom.id,
            name: savedClassRoom.name,
          },
        },
      },
      { returnOriginal: false }
    );

    const response = {
      status: 201,
      message: "success",
      data: {
        subjectRelated,
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function updateClass(req, res, next) {
  try {
    const { id } = req.params;

    const classRoom = await Class.findById(id);
    if (!classRoom) throw createError.NotFound("Class Not Found.");

    const filter = { _id: id };
    const updateData = req.body;

    const updatedClass = await Class.findOneAndUpdate(
      filter,
      {
        $set: updateData,
      },
      { returnOriginal: false }
    );

    const response = {
      status: 200,
      message: "success",
      data: {
        subject: updatedClass.subject,
        name: updatedClass.name,
        day: updatedClass.day,
        startAt: updatedClass.startAt,
        endAt: updatedClass.endAt,
        assistants: updatedClass.assistants,
        quota: updatedClass.quota,
        isFull: updatedClass.isFull,
        participants: updatedClass.participants,
        learningModule: updatedClass.learningModule,
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function deleteClass(req, res, next) {
  try {
    const { id } = req.params;

    const classRoom = await Class.findById(id);
    if (!classRoom) throw createError.NotFound("Class Not Found");

    await Class.deleteOne({ _id: id });

    const response = {
      status: 200,
      message: "deleted",
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function registerToClassRoom(req, res, next) {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const classRoom = await Class.findById(id);
    const user = await User.findById(userId);

    let isFull =
      classRoom.isFull || classRoom.participants.length === classRoom.quota;
    if (isFull) throw createError.Conflict("Classroom is already full");

    const isRegistered = await Class.findOne({
      _id: id,
      "participants._id": user.id,
    });
    if (isRegistered) throw createError.Conflict("User already registered");

    const filter = { _id: id };
    let updatedClassRoom = await Class.findOneAndUpdate(
      filter,
      {
        $push: {
          participants: {
            _id: user.id,
            name: user.fullname,
          },
        },
      },
      {
        returnOriginal: false,
      }
    ).exec();

    if (updatedClassRoom.participants.length === updatedClassRoom.quota)
      updatedClassRoom = await Class.findOneAndUpdate(
        filter,
        { $set: { isFull: true } },
        { returnOriginal: false }
      );

    const response = {
      status: 200,
      message: "added",
      data: {
        name: updatedClassRoom.name,
        day: updatedClassRoom.day,
        quota: updatedClassRoom.quota,
        isFull: updatedClassRoom.isFull,
        participants: updatedClassRoom.participants,
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllClasses,
  getClass,
  addClass,
  updateClass,
  deleteClass,
  registerToClassRoom,
};
