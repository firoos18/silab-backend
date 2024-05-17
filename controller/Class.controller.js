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
      data: classes.map((classRoom) => ({
        id: classRoom._id,
        subjectId: classRoom.subjectId,
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

    const doesExist = await Class.findOne({ name: result.name });
    if (doesExist)
      throw createError.Conflict(`${result.name} is Already Added.`);

    const doesSubjectExist = await Subject.findById(result.subjectId);
    if (!doesSubjectExist) throw createError.NotFound("Class Not Found.");

    const classRoom = new Class(result);
    const savedClassRoom = await classRoom.save();

    const filter = { _id: result.subjectId };
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
      data: subjectRelated,
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

    const subjectId = classRoom.subjectId;
    await Subject.findOneAndUpdate(
      { _id: subjectId },
      { $pull: { classes: { _id: id } } },
      { returnOriginal: false }
    );

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
    if (!classRoom) throw createError.NotFound("Class Not Found.");

    const user = await User.findById(userId);
    if (!user) throw createError.NotFound("User Not Found.");

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

async function unregisterFromClassRoom(req, res, next) {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user) throw createError.NotFound("User Not Found.");

    const classRoom = await Class.findById(id);
    if (!classRoom) throw createError.NotFound("Class Not Found.");

    const isRegistered = await Class.findOne({
      _id: id,
      "participants._id": user.id,
    });
    if (!isRegistered) throw createError.Conflict("User Not Registered");

    let updatedClassRoom = await Class.findOneAndUpdate(
      { _id: classRoom._id },
      {
        $pull: {
          participants: { _id: user._id },
        },
      },
      {
        returnOriginal: false,
      }
    );

    if (updatedClassRoom.participants.length < updatedClassRoom.quota)
      updatedClassRoom = await Class.findOneAndUpdate(
        { _id: classRoom._id },
        { $set: { isFull: false } },
        { returnOriginal: false }
      );

    const response = {
      status: 200,
      message: "unregistered",
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

async function getClassQuota(req, res, next) {
  try {
    const { id } = req.params;

    const doesExist = Class.findById(id);
    if (!doesExist) throw createError.NotFound("Class Not Found.");

    const pipeline = {
      $match: { "fullDocument._id": id },
    };

    const changeStreams = await Class.watch(pipeline);
    changeStreams.on("change", (change) => {
      const classData = Class.findById(change.documentKey._id);
      console.log(classData);
    });

    res.send("Get Class Quota");
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
  unregisterFromClassRoom,
  getClassQuota,
};
