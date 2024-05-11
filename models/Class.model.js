const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = Schema({
  subjectId: {
    type: Schema.Types.ObjectId,
    refs: "subject",
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
      id: { type: Schema.Types.ObjectId, refs: "user", sparse: true },
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
      id: { type: Schema.Types.ObjectId, refs: "user", sparse: true },
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
        refs: "module",
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

const Class = mongoose.model("class", ClassSchema);
module.exports = Class;
