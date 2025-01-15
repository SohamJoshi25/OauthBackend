//Constants
const APP_DOMAIN = process.env.NODE_ENV == "DEVELOPMENT" ? `http://localhost:${process.env.PORT}` : process.env.DEPLOYMENT_HOST

//Redirect URL
const GOOGLE_REDIRECT_URL = APP_DOMAIN + "/v1/auth/google/callback";
const DROPBOX_REDIRECT_URL = APP_DOMAIN + "/v1/auth/dropbox/callback";
const SNAPCHAT_REDIRECT_URL = APP_DOMAIN + "/v1/auth/snapchat/callback";
const MEDIUM_REDIRECT_URL = APP_DOMAIN + "/v1/auth/medium/callback";
const WORDPRESS_REDIRECT_URL = APP_DOMAIN + "/v1/auth/wordpress/callback";
const SHOPIFY_REDIRECT_URL = APP_DOMAIN + "/v1/auth/shopify/callback";

module.exports = {APP_DOMAIN,GOOGLE_REDIRECT_URL,DROPBOX_REDIRECT_URL,SNAPCHAT_REDIRECT_URL,MEDIUM_REDIRECT_URL,WORDPRESS_REDIRECT_URL,SHOPIFY_REDIRECT_URL}