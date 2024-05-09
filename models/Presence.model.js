const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PresenceSchema = Schema({
  class: {
    type: Schema.Types.ObjectId,
    refs: "subject",
  },
  date: {
    type: Date,
    required: true,
  },
  payload: {
    type: String,
    required: true,
  },
  participants: {
    type: Schema.Types.ObjectId,
    refs: "user",
  },
});
