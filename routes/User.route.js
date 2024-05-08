const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const UserController = require("../controller/User.controller");

router.get("/", verifyAccessToken, UserController.getAllUsers);

router.get("/:nim", verifyAccessToken, UserController.getUserByNim);

module.exports = router;
