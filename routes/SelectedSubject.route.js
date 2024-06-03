const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const SelectedSubjectController = require("../controller/SelectedSubject.controller");

router.get(
  "/",
  verifyAccessToken,
  SelectedSubjectController.getAllSelectedSubjects
);

router.get(
  "/:id",
  verifyAccessToken,
  SelectedSubjectController.getSelectedSubjectById
);

router.post(
  "/",
  verifyAccessToken,
  SelectedSubjectController.addSelectedSubject
);

router.patch(
  "/",
  verifyAccessToken,
  SelectedSubjectController.updateSelectedSubject
);

module.exports = router;
