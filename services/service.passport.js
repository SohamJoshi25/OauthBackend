const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
const SnapchatStrategy = require('passport-snapchat').Strategy 
const refresh = require("passport-oauth2-refresh");
const passportCallBack = require("../controllers/controller.passport.js");
require("dotenv").config()

// Google Strategy Drive
const googleStrategyDrive = new GoogleStrategy({
    callbackURL: process.env.NODE_ENV=="DEVELOPMENT"? "http://localhost:4006/auth/google/callback" :"https://oauthbackend-sfc8.onrender.com/auth/google/callback",
    clientID: process.env.GoogleDriveClientId,
    clientSecret: process.env.GoogleDriveClientSecret,
    accessType: 'offline',
    prompt: 'consent',
    passReqToCallback: true
},passportCallBack);

passport.use('google-drive',googleStrategyDrive);
refresh.use('google-drive',googleStrategyDrive);


// Google Strategy Photo
const googleStrategyPhotos = new GoogleStrategy({
    callbackURL: process.env.NODE_ENV=="DEVELOPMENT"?"http://localhost:4006/auth/google/callback":"https://oauthbackend-sfc8.onrender.com/auth/google/callback",
    clientID: process.env.GooglePhotosClientId,
    clientSecret: process.env.GooglePhotosClientSecret,
    accessType: 'offline',
    prompt: 'consent',
    passReqToCallback: true
},passportCallBack);

passport.use('google-photos',googleStrategyPhotos);
refresh.use('google-photos',googleStrategyPhotos);

// Google Strategy Business
const googleStrategyBusiness = new GoogleStrategy({
    callbackURL: process.env.NODE_ENV=="DEVELOPMENT"?"http://localhost:4006/auth/google/callback":"https://oauthbackend-sfc8.onrender.com/auth/google/callback",
    clientID: process.env.GoogleSohamClientId,
    clientSecret: process.env.GoogleSohamClientSecret,
    accessType: 'offline',
    prompt: 'consent',
    passReqToCallback: true
},passportCallBack);

passport.use('google-business',googleStrategyBusiness);
refresh.use('google-business',googleStrategyBusiness);


// Dropbox Strategy
const dropboxStrategy = new DropboxStrategy({
    apiVersion: '2',
    callbackURL: process.env.NODE_ENV=="DEVELOPMENT"?"http://localhost:4006/auth/dropbox/callback":"https://oauthbackend-sfc8.onrender.com/auth/dropbox/callback",
    clientID: process.env.DropboxClientId,
    clientSecret: process.env.DropboxClientSecret,
    token_access_type:"offline",
    passReqToCallback: true,
    force_reapprove:true
}, (req,a,r,p,d) => {passportCallBack(req,a,r,p,d,1800)});

passport.use(dropboxStrategy);
refresh.use(dropboxStrategy);



// Snapchat Strategy
const snapchatStrategy = new SnapchatStrategy({
    clientID: process.env.SnapChatClientID,
    clientSecret: process.env.SnapChatClientSecret,
    callbackURL: process.env.NODE_ENV=="DEVELOPMENT"?"http://localhost:4006/auth/snapchat/callback":"https://oauthbackend-sfc8.onrender.com/auth/snapchat/callback",
    scope: ['user.display_name', 'user.bitmoji.avatar'],
    profileFields: ['id', 'displayName', 'bitmoji.avatar', 'bitmoji.headshot', 'avatarId'],
    pkce: true,
    state:true,
    passReqToCallback: true
}, (req,a,r,p,d) => {passportCallBack(req,a,r,p,d,1800)});//custom expiry

passport.use(snapchatStrategy);
refresh.use(snapchatStrategy);



// Serialize User
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize User
passport.deserializeUser((user, done) => {
    done(null, user);
});



module.exports = passport;
