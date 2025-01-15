const express = require("express")
const router = express.Router();
const passport = require("passport")


//Controllers
const { accessToken, handleOAuthRedirect, logout } = require("../controllers/auth.controller.js")
const { mediumAuthenticate } = require("../controllers/auth.controller.js")
const { mediumCallBack } = require('../middlewares/callback.middleware.js')


// Middleware
const returnTo = require('../middlewares/returnTo.middleware.js')
const decodeJwt = require('../middlewares/decodejwt.middleware.js')


//Auth Options and Configurations

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
  token_access_type: 'offline',
  scope: 'files.metadata.read files.content.read account_info.read'
};


//Google Apps auth Routing
const googleAppRoute = (req, res, next) => {
  if (req.session.appName == "google-drive") {

    return passport.authenticate('google-drive', googleDriveOptions)(req, res, next);

  } else if (req.session.appName == "google-photos") {

    return passport.authenticate('google-photos', googlePhotosOptions)(req, res, next);

  }else if (req.session.appName == "google-business") {

    return passport.authenticate('google-business', googleBusinessOptions)(req, res, next);
  }
  else{
    return res.status(400).json({message:"App name not found in session"});
  }
};

//Google Apps Callback Routing
const googleCallbackRoute = (req, res, next) => {
  if (req.session.appName == "google-drive") {

    return passport.authenticate('google-drive', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true })(req, res, next);

  } else if (req.session.appName == "google-photos") {

    return passport.authenticate('google-photos', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true })(req, res, next);

  }else if (req.session.appName == "google-business") {

    return passport.authenticate('google-business', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true })(req, res, next);
  }else{
    return res.status(400).json({message:"App name not found in session from Google Callback"});
  }
};


router.get('/google',returnTo ,decodeJwt ,googleAppRoute)
router.get('/google/callback', googleCallbackRoute , handleOAuthRedirect)


router.get('/dropbox',returnTo ,decodeJwt ,passport.authenticate('dropbox-oauth2',dropboxOptions));
router.get('/dropbox/callback', passport.authenticate('dropbox-oauth2', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true }),handleOAuthRedirect);


router.get('/snapchat',returnTo ,decodeJwt ,passport.authenticate('snapchat'));
router.get('/snapchat/callback', passport.authenticate('snapchat', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true }) , handleOAuthRedirect);


router.get('/wordpress',returnTo ,decodeJwt ,passport.authenticate('wordpress'));
router.get('/wordpress/callback', passport.authenticate('wordpress', { failureRedirect: 'https://www.app.creatosaurus.io/',keepSessionInfo: true }) , handleOAuthRedirect);


router.get('/medium',returnTo ,decodeJwt ,mediumAuthenticate)
router.get('/medium/callback', mediumCallBack , handleOAuthRedirect)


router.get('/accesstoken', decodeJwt, accessToken)
router.get('/logout', decodeJwt, logout)


module.exports = router;
