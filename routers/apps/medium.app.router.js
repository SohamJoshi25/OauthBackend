const express = require("express")
const router = express.Router();

//import Medium
const { fetchData, postPublications } = require("../../controllers/apps/medium.app.controller.js")

//medium
router.route("/").get(fetchData).post(postPublications);

module.exports = router;