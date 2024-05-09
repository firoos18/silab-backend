const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.get("/", verifyAccessToken);

router.post("/", verifyAccessToken);

router.patch("/", verifyAccessToken);
