const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = Schema({
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  day: {
    type: String,
    required: true,
  },
  startAt: {
    type: String,
    required: true,
  },
  endAt: {
    type: String,
    required: true,
  },
  assistants: [
    {
      id: { type: Schema.Types.ObjectId, ref: "user", sparse: true },
      name: {
        type: String,
        required: true,
      },
    },
    { default: [] },
  ],
  quota: {
    type: Number,
    required: true,
  },
  isFull: {
    type: Boolean,
    required: true,
    default: false,
  },
  participants: [
    {
      id: { type: Schema.Types.ObjectId, ref: "user", sparse: true },
      name: {
        type: String,
        required: true,
      },
    },
    {
      default: [],
    },
  ],
  learningModule: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "module",
      },
      name: {
        type: String,
        required: true,
      },
    },
    {
      default: [],
    },
  ],
});

ClassSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    return {
      id: ret.id,
      subject: ret.subjectId,
      name: ret.name,
      quota: ret.quota,
      isFull: ret.isFull,
      day: ret.day,
      startAt: ret.startAt,
      endAt: ret.endAt,
      participants: ret.participants,
      learningModule: ret.learningModule,
    };
  },
});

const Class = mongoose.model("class", ClassSchema);
module.exports = Class;
