const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const ClassController = require("../controller/Class.controller.mjs");

router.get("/", verifyAccessToken, ClassController.getAllClasses);

router.get("/:id", verifyAccessToken, ClassController.getClass);

router.post("/", verifyAccessToken, ClassController.addClass);

router.patch("/:id", verifyAccessToken, ClassController.updateClass);

router.delete("/:id", verifyAccessToken, ClassController.deleteClass);

router.patch(
  "/register/:id",
  verifyAccessToken,
  ClassController.registerToClassRoom
);

router.patch(
  "/unregister/:id",
  verifyAccessToken,
  ClassController.unregisterFromClassRoom
);

module.exports = router;
