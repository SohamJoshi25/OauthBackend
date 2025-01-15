const express = require("express")
const router = express.Router();

const { getData, postWordpress, fetchPosts} = require('../../controllers/apps/wordpress.app.controller')

router.route('/').get(getData).post(postWordpress);
router.route("/post/:siteId").get(fetchPosts);

module.exports = router;