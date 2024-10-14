const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
const SnapchatStrategy = require('passport-snapchat').Strategy 
const refresh = require("passport-oauth2-refresh");
const passportCallBack = require("../controllers/controller.passport.js");
require("dotenv").config()

// Google Strategy
const googleStrategy = new GoogleStrategy({
    callbackURL: "/auth/google/callback",
    clientID: process.env.ClientId,
    clientSecret: process.env.ClientSecret,
    accessType: 'offline',
    prompt: 'consent',
    passReqToCallback: true
},passportCallBack);

passport.use(googleStrategy);
refresh.use(googleStrategy);



// Dropbox Strategy
const dropboxStrategy = new DropboxStrategy({
    apiVersion: '2',
    callbackURL: "/auth/dropbox/callback",
    clientID: process.env.DropboxClientId,
    clientSecret: process.env.DropboxClientSecret,
    accessType: 'offline',
    passReqToCallback: true
}, (req,a,r,p,d) => {passportCallBack(req,a,r,p,d,1800)});

passport.use(dropboxStrategy);
refresh.use(dropboxStrategy);



// Snapchat Strategy
const snapchatStrategy = new SnapchatStrategy({
    clientID: 'f31866cb-c917-4f30-aba6-2b1da3a0a0ae',
    clientSecret: 'gN4tokiyF8Ef8sVx1vHsf_YWydqOB8y3RGlziYPx0vg',
    callbackURL: "http://localhost:4006/cache/snapchat/auth/callback",
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
