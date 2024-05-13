const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const Role = mongoose.model("role", RoleSchema);
module.exports = Role;
