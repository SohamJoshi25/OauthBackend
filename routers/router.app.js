const express = require("express")
const router = express.Router();
const passport = require("passport")
const AppController = require("../controllers/controller.app.js")

// Middleware
const returnTo = require('../middlewares/middleware.returnTo.js')
const decodeJwt = require('../middlewares/middleware.decodejwt.js')

const googleDriveOptions = { scope: [
  'https://www.googleapis.com/auth/drive',
  'profile',
  'email'
],accessType: 'offline', approvalPrompt: 'force' }


const googlePhotosOptions = { scope: [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'profile',
  'email'
],accessType: 'offline', approvalPrompt: 'force' }

const googleBusinessOptions = { scope: [
  'https://www.googleapis.com/auth/business.manage',
  'profile',
  'email'
],accessType: 'offline', approvalPrompt: 'force' }

const dropboxOptions = {
  token_access_type: 'offline', // Request offline access for a refresh token
  scope: 'files.metadata.read files.content.read account_info.read'
};

const googleAppRoute = (req, res, next) => {
  if (req.session.appName == "google-drive") {

    return passport.authenticate('google-drive', googleDriveOptions)(req, res, next);

  } else if (req.session.appName == "google-photos") {

    return passport.authenticate('google-photos', googlePhotosOptions)(req, res, next);

  }else if (req.session.appName == "google-business") {

    return passport.authenticate('google-business', googleBusinessOptions)(req, res, next);

  }
  else{
    return res.status(400).send("App name not found in session");
  }
};

const googleCallback = (req, res, next) => {
  console.log(req.session)
  if (req.session.appName == "google-drive") {

    return passport.authenticate('google-drive', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true })(req, res, next);

  } else if (req.session.appName == "google-photos") {

    return passport.authenticate('google-photos', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true })(req, res, next);

  }else if (req.session.appName == "google-business") {

    return passport.authenticate('google-business', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true })(req, res, next);
  }else{
    return res.status(400).send("App name not found in session from Google Callback");
  }
};


router.get("/getAccessToken", decodeJwt, AppController.accessToken)
router.get("/logOut", decodeJwt, AppController.logout)



router.get("/auth/google",returnTo ,decodeJwt ,googleAppRoute)
router.get('/auth/google/callback', googleCallback , AppController.commonCallBack)

router.get('/auth/dropbox',returnTo ,decodeJwt ,passport.authenticate('dropbox-oauth2',dropboxOptions));

router.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true }),AppController.commonCallBack);



router.get('/auth/snapchat',returnTo ,decodeJwt ,passport.authenticate('snapchat'));

router.get('/cache/snapchat/auth/callback', passport.authenticate('snapchat', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true }) , AppController.commonCallBack);



router.get("/",(request,response) => {
  response.send("Health OK")
})

module.exports = router;
