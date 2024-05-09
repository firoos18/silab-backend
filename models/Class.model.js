const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = Schema({
  subject: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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
      type: Schema.Types.ObjectId,
      refs: "user",
      default: [],
    },
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
      type: Schema.Types.ObjectId,
      refs: "user",
      default: [],
    },
  ],
  learningModule: [
    {
      type: Schema.Types.ObjectId,
      refs: "module",
      default: [],
    },
  ],
});

const Class = mongoose.model("class", ClassSchema);
module.exports = Class;
