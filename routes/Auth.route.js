const express = require("express");
const router = express.Router();
const AuthController = require("../controller/Auth.controller");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh-token");

router.delete("/logout");

module.exports = router;
