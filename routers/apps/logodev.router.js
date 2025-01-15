const express = require("express")
const router = express.Router();

const {downloadImage} = require("../../controllers/apps/logodev.app.controller")

router.get("/",downloadImage);

module.exports = router;