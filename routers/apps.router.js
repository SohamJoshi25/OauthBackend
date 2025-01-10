const express = require("express")
const router = express.Router();

//import Apps Router.
const MediumRouter = require("./apps/medium.app.router.js");

//Mount Sub Routers
router.use("/medium",MediumRouter);

module.exports = router;