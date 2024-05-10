const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const SubjectController = require("../controller/Subject.controller");

router.get("/", verifyAccessToken, SubjectController.getAllSubjects);

router.get("/:id", verifyAccessToken, SubjectController.getSubject);

router.post("/", verifyAccessToken, SubjectController.addSubject);

router.patch("/:id", verifyAccessToken, SubjectController.updateSubject);

router.delete("/:id", verifyAccessToken, SubjectController.deleteSubject);

module.exports = router;
