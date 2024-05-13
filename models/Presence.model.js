const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PresenceSchema = Schema({
  classId: {
    type: Schema.Types.ObjectId,
    refs: "class",
  },
  date: {
    type: Date,
    required: true,
  },
  payload: {
    type: String,
    required: true,
  },
  participants: [
    {
      id: { type: Schema.Types.ObjectId, refs: "user" },
      name: { type: String, required: true },
    },
    { default: [] },
  ],
});

const Presence = mongoose.model("presence", PresenceSchema);
module.exports = Presence;
