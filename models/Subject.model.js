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
});

const Subject = mongoose.model("subject", SubjectSchema);
module.exports = Subject;
