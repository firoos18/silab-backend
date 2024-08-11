const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["asprak", "praktikum", "inhal", "pengumuman"],
  },
  desc: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: false,
  },
});

AnnouncementSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    return {
      id: ret.id,
      title: ret.title,
      type: ret.type,
      desc: ret.desc,
      posterUrl: ret.posterUrl,
    };
  },
});

const Announcement = mongoose.model("announcement", AnnouncementSchema);
module.exports = Announcement;
