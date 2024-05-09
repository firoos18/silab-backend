const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  lecturer: {
    type: String,
    required: true,
  },
  classes: [
    {
      type: Schema.Types.ObjectId,
      refs: "class",
      default: [],
    },
  ],
});

const Subject = mongoose.model("subject", SubjectSchema);
module.exports = Subject;
