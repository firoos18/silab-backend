const express = require("express");
const router = express.Router();
const AnnouncementController = require("../controller/Announcement.controller");
const { verifyAccessToken } = require("../helpers/jwt_helper");
const { upload } = require("../middleware/upload");

router.get("/", verifyAccessToken, AnnouncementController.getAllAnnouncements);

router.get("/:id", verifyAccessToken, AnnouncementController.getAnnouncement);

router.post(
  "/",
  verifyAccessToken,
  upload,
  AnnouncementController.addAnnouncement
);

router.get("/:id/image", AnnouncementController.servePosterImage);

router.patch(
  "/:id",
  verifyAccessToken,
  upload,
  AnnouncementController.editAnnouncement
);

router.delete(
  "/:id",
  verifyAccessToken,
  AnnouncementController.deleteAnnouncement
);

module.exports = router;
