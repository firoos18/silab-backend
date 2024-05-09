const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const SubjectController = require("../controller/Subject.controller");

router.get("/", verifyAccessToken, SubjectController.getAllSubjects);

router.get("/:name", verifyAccessToken, SubjectController.getSubject);

router.post("/", verifyAccessToken, SubjectController.addSubject);

router.patch("/:name", verifyAccessToken, SubjectController.updateSubject);

router.delete("/:name", verifyAccessToken, SubjectController.deleteSubject);

module.exports = router;
