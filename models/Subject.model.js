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
      ref: "class",
    },
    {
      default: [],
    },
  ],
});

SubjectSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    return {
      id: ret.id,
      name: ret.name,
      lecturer: ret.lecturer,
      classes: ret.classes,
    };
  },
});

const Subject = mongoose.model("subject", SubjectSchema);
module.exports = Subject;
