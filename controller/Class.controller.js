const createError = require("http-errors");
const Class = require("../models/Class.model");
const { classSchema } = require("../helpers/validation_schema");
const Subject = require("../models/Subject.model");
const User = require("../models/User.model");

export const config = {
  runtime: "nodejs",
};

async function getAllClasses(req, res, next) {
  try {
    const classes = await Class.find()
      .populate("subjectId")
      .populate("participants")
      .populate("assistants");
    const response = {
      status: 200,
      message: "success",
      data: classes,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getClass(req, res, next) {
  try {
    const { id } = req.params;

    const classRoom = await Class.findById(id)
      .populate("subjectId")
      .populate("participants")
      .populate("assistants");
    if (!classRoom) throw createError.NotFound("Class Not Found.");

    const response = {
      status: 200,
      message: "success",
      data: classRoom,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function addClass(req, res, next) {
  try {
    const result = await classSchema.validateAsync(req.body);

    const doesExist = await Class.findOne({
      subjectId: result.subjectId,
      name: result.name,
    });
    if (doesExist)
      throw createError.Conflict(`${result.name} is Already Added.`);

    const relatedSubject = await Subject.findById(result.subjectId);
    if (!relatedSubject) throw createError.NotFound("Subject Not Found.");

    const classRoom = new Class(result);
    await classRoom.save();

    relatedSubject.classes.push(classRoom._id);
    await relatedSubject.save();

    const response = {
      status: 201,
      message: "success",
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

    if (Object.hasOwn(updateData, "subjectId")) {
      await Subject.findByIdAndUpdate(classRoom.subjectId, {
        $pull: { classes: classRoom._id },
      });
      await Subject.findByIdAndUpdate(updateData.subjectId, {
        $push: { classes: classRoom._id },
      });
    }

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
      data: updatedClass,
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

    updatedClassRoom = await Class.findById(id)
      .populate("subjectId")
      .populate("participants")
      .populate("assistants");

    const response = {
      status: 200,
      message: "added",
      data: updatedClassRoom,
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

    updatedClassRoom = await Class.findById(id)
      .populate("subjectId")
      .populate("participants")
      .populate("assistants");

    const response = {
      status: 200,
      message: "unregistered",
      data: updatedClassRoom,
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
  unregisterFromClassRoom,
};