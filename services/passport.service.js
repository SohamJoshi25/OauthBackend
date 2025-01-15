const passport = require("passport");

//Import Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
const SnapchatStrategy = require('passport-snapchat').Strategy;
const WordpressStrategy = require('passport-wordpress').Strategy;
const ShopifyStrategy = require('passport-shopify').Strategy;

const refresh = require("passport-oauth2-refresh");
const { passportCallBack } = require("../middlewares/callback.middleware.js");

const {GOOGLE_REDIRECT_URL,DROPBOX_REDIRECT_URL,SNAPCHAT_REDIRECT_URL,WORDPRESS_REDIRECT_URL,SHOPIFY_REDIRECT_URL} = require("../data/constants.data.js")


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



// Wordpress Strategy
const wordpressStrategy = new WordpressStrategy({
    clientID: process.env.WordpressClientId,
    clientSecret: process.env.WordpressClientSecret,
    callbackURL:  WORDPRESS_REDIRECT_URL,
    passReqToCallback: true
}, (req,a,r,p,d) => {passportCallBack(req,a,r,p,d,10000)});

passport.use(wordpressStrategy);
refresh.use(wordpressStrategy);



// Shopify Strategy
// const shopifyStrategy = new ShopifyStrategy({
//     clientID: process.env.ShopifyClientId,
//     clientSecret: process.env.ShopifyClientSecret,
//     callbackURL:  SHOPIFY_REDIRECT_URL,
//     shop:'{SHOP}',
//     passReqToCallback: true
// }, (req,a,r,p,d) => {passportCallBack(req,a,r,p,d)});

// passport.use(shopifyStrategy);
// refresh.use(shopifyStrategy);



// Serialize User
passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user);
});

// Deserialize User
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
