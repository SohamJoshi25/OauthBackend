const passport = require("passport");

//Import Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
const SnapchatStrategy = require('passport-snapchat').Strategy 

const refresh = require("passport-oauth2-refresh");
const { passportCallBack } = require("../middlewares/callback.middleware.js");

const {GOOGLE_REDIRECT_URL,DROPBOX_REDIRECT_URL,SNAPCHAT_REDIRECT_URL} = require("../data/constants.data.js")


// Google Strategy Drive
const googleStrategyDrive = new GoogleStrategy({
    callbackURL: GOOGLE_REDIRECT_URL,
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
    callbackURL:  GOOGLE_REDIRECT_URL,
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
    callbackURL:  GOOGLE_REDIRECT_URL,
    clientID: process.env.GoogleBusinessClientId,
    clientSecret: process.env.GoogleBusinessClientSecret,
    accessType: 'offline',
    prompt: 'consent',
    passReqToCallback: true
},passportCallBack);

passport.use('google-business',googleStrategyBusiness);
refresh.use('google-business',googleStrategyBusiness);


// Dropbox Strategy
const dropboxStrategy = new DropboxStrategy({
    apiVersion: '2',
    callbackURL:  DROPBOX_REDIRECT_URL,
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
    clientID: process.env.SnapChatClientId,
    clientSecret: process.env.SnapChatClientSecret,
    callbackURL:  SNAPCHAT_REDIRECT_URL,
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
