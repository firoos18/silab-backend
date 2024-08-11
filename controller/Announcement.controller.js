const createError = require("http-errors");
const Announcement = require("../models/Announcement.model");
const getImageUrl = require("../helpers/get_image_url");
const { getGfs } = require("../helpers/init_mongodb");
const {
  uploadPosterImage,
  deletePosterImage,
} = require("../helpers/init_supabase");

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

    let posterUrl = null;

    const announcement = new Announcement({
      type: type,
      desc: desc,
    });

    if (req.file) {
      posterUrl = await uploadPosterImage(req.file, announcement._id);
    }
    announcement.posterUrl = posterUrl;

    const savedAnnouncement = await announcement.save();

    const response = {
      status: 200,
      message: "added",
      data: savedAnnouncement,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function editAnnouncement(req, res, next) {
  try {
    const { id } = req.params;
    const { type, desc } = req.body;

    const announcement = await Announcement.findById(id);
    if (!announcement)
      throw createError.NotFound(`Announcement with ID ${id} is not found`);

    let posterUrl;
    if (req.file) {
      posterUrl = await uploadPosterImage(req.file, announcement._id);
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      {
        $set: {
          type: type ? type : announcement.type,
          desc: desc ? desc : announcement.desc,
          posterUrl: req.file ? posterUrl : announcement.posterUrl,
        },
      },
      { returnOriginal: false }
    );

    res.status(200).json({
      status: 200,
      message: "updated",
      data: updatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement)
      throw createError.NotFound(`Announcement with ID ${id} is not found`);

    await deletePosterImage(announcement._id);

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
  deleteAnnouncement,
  editAnnouncement,
};
