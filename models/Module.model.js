const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModuleSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  file: {
    type: Buffer,
    required: true,
  },
});

const Module = mongoose.model("module", ModuleSchema);
module.exports = Module;
