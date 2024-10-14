const express = require("express")
const router = express.Router();
const passport = require("passport")
const AppController = require("../controllers/controller.app.js")

// Middleware
const returnTo = require('../middlewares/middleware.returnTo.js')
const decodeJwt = require('../middlewares/middleware.decodejwt.js')

const googleOptions = { scope: [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/youtube.readonly',
  'profile',
  'email'
],
accessType: 'offline', approvalPrompt: 'force' }



router.get("/getAccessToken", decodeJwt, AppController.accessToken)
router.get("/logOut", decodeJwt, AppController.logout)




router.get("/auth/google",returnTo ,decodeJwt ,passport.authenticate('google', googleOptions))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/',keepSessionInfo: true }), AppController.commonCallBack);



router.get('/auth/dropbox',returnTo ,decodeJwt ,passport.authenticate('dropbox-oauth2'));

router.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', { failureRedirect: '/',keepSessionInfo: true }),AppController.commonCallBack);



router.get('/auth/snapchat',returnTo ,decodeJwt ,passport.authenticate('snapchat'));

router.get('/cache/snapchat/auth/callback', passport.authenticate('snapchat', { failureRedirect: '/',keepSessionInfo: true }) , AppController.commonCallBack);



router.get("/",(request,response) => {
  response.send("Health OK")
})

module.exports = router;
