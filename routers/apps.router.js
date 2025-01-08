const express = require("express")
const router = express.Router();

//import Medium
const { fetchData, postPublications } = require("../controllers/apps/medium.controller.js")

//medium
router.route("/medium").get(fetchData).post(postPublications);

module.exports = router;