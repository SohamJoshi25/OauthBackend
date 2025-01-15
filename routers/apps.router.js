const express = require("express")
const router = express.Router();

//import Apps Router.
const MediumRouter = require("./apps/medium.app.router.js");
const WordPressRouter = require("./apps/wordpress.app.router.js")
const LogodevRouter = require('./apps/logodev.router.js')

//Mount Sub Routers
router.use("/medium",MediumRouter);
router.use("/wordpress",WordPressRouter);
router.use("/logodev",LogodevRouter);

module.exports = router;