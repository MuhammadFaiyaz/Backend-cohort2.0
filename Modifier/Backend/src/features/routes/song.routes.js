const express = require("express");
const upload = require("../middleware/upload.middleware");
const { songUpload, getSong } = require("../controllers/song.controller");
const songRouter = express.Router();

songRouter.get("/", getSong);
songRouter.post("/", upload.single("song"), songUpload);

module.exports = songRouter;