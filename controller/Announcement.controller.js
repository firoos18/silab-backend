const createError = require("http-errors");
const Announcement = require("../models/Announcement.model");
const getImageUrl = require("../helpers/get_image_url");
const { getGfs } = require("../helpers/init_mongodb");

async function getAllAnnouncements(req, res, next) {
  try {
    const announcementList = await Announcement.find();

    const response = {
      status: 200,
      message: "success",
      data: announcementList.map((announcement) => ({
        id: announcement.id,
        type: announcement.type,
        desc: announcement.desc,
        posterUrl: announcement.posterId
          ? getImageUrl(req.protocol, req.get("host"), announcement)
          : null,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getAnnouncement(req, res, next) {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findById(id);
    if (!announcement)
      throw createError.NotFound(`Announcement with ID ${id} is Not Found`);

    const response = {
      status: 200,
      message: "success",
      data: {
        id: announcement.id,
        type: announcement.type,
        desc: announcement.desc,
        posterUrl: getImageUrl(req.protocol, req.get("host"), announcement),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function addAnnouncement(req, res, next) {
  try {
    const { type, desc } = req.body;

    const announcement = new Announcement({
      type: type,
      desc: desc,
      posterId: req.file ? req.file.id : null,
    });

    const savedAnnouncement = await announcement.save();
    const posterUrl = req.file
      ? getImageUrl(req.protocol, req.get("host"), savedAnnouncement)
      : null;

    savedAnnouncement.toJson = function () {
      return {
        id: this._id,
        type: this.type,
        desc: this.desc,
        posterUrl: posterUrl,
      };
    };

    const response = {
      status: 200,
      message: "added",
      data: savedAnnouncement.toJson(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function servePosterImage(req, res, next) {
  try {
    const { id } = req.params;
    const gfs = getGfs();

    const announcement = await Announcement.findById(id);
    if (!announcement)
      throw createError.NotFound(`Announcement with ID ${id} is Not Found`);

    const file = await gfs.find({ _id: announcement.posterId }).toArray();
    if (!file || file.length === 0)
      throw createError.NotFound(
        `Poster Image for Announcement ${announcement.id} is Not Found`
      );

    const readStream = gfs.openDownloadStream(announcement.posterId);
    res.set("Content-Type", file[0].contentType);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

async function editAnnouncement(req, res, next) {
  try {
    const { id } = req.params;
    const { type, desc } = req.body;
    const file = req.file ? req.file.id : null;

    const announcement = await Announcement.findById(id);
    if (!announcement)
      throw createError.NotFound(`Announcement with ID ${id} is not found`);

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      {
        $set: {
          type: type ? type : announcement.type,
          desc: desc ? desc : announcement.desc,
          posterId: file ? file : announcement.posterId,
        },
      },
      { returnOriginal: false }
    );

    res.status(200).json({
      status: 200,
      message: "updated",
      data: {
        id: updatedAnnouncement._id,
        type: updatedAnnouncement.type,
        desc: updatedAnnouncement.desc,
        posterUrl: file
          ? getImageUrl(req.protocol, req.get("host"), updatedAnnouncement)
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;
    const gfs = getGfs();

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement)
      throw createError.NotFound(`Announcement with ID ${id} is not found`);

    await gfs.delete(announcement.posterId);

    res.status(200).json({
      status: 200,
      message: "deleted",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllAnnouncements,
  getAnnouncement,
  addAnnouncement,
  servePosterImage,
  deleteAnnouncement,
  editAnnouncement,
};
