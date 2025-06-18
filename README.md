# OAuth Backend Microservice

A powerful OAuth 2.0 microservice developed during an internship at [Creatosaurus.io](https://creatosaurus.io), built to handle secure authentication and token lifecycle management for multiple third-party platforms. Designed to unify and simplify OAuth flows across a wide range of APIs for internal tools and dashboards.

## 🎯 Aim

To serve as a centralized authentication gateway for all integrated third-party apps. This microservice manages the entire OAuth flow, token lifecycle (including refresh), and session management — abstracting complexity from front-end or dependent microservices.

## 🔧 What It Does

- Handles complete OAuth 2.0 Authorization Code flow.
- Stores and manages access + refresh tokens.
- Automatically refreshes expired tokens when needed.
- Maintains secure sessions per authenticated user.
- Provides scoped routes for each supported service.
- Offers proxy endpoints for related utilities (e.g., Clearbit).

## 🔐 Supported OAuth Providers

This microservice handles OAuth-based authentication for the following providers:

- ✅ **Google Drive**
- ✅ **Google Photos**
- ✅ **Google My Business**
- ✅ **Dropbox**
- ✅ **Snapchat**
- ✅ **Medium**
- ✅ **WordPress**

> Passport.js was used where possible. For providers lacking Passport strategies or needing deeper integration, custom flows were implemented.

## ✨ Features

- 🔁 Full OAuth flow per provider (with modular route separation).
- 🔐 Session management for user state persistence.
- 🔄 Automatic refresh token handling.
- 🧩 Pluggable route-based architecture — easily extensible.
- 🔧 Includes proxy endpoints (e.g., Clearbit) for external API communication (non-auth).
- 📦 Built with Express.js and Passport.js (plus custom logic).

## 📁 Code Structure

OauthBackend/
├── config/
│ ├── passport-google.js # Google OAuth strategy config
│ ├── passport-dropbox.js # Dropbox OAuth config
│ └── passport-snapchat.js # Snapchat OAuth (custom/Passport)
├── routes/
│ ├── medium.js # Medium OAuth route
│ ├── wordpress.js # WordPress OAuth route
│ ├── dropbox.js # Dropbox OAuth route
│ ├── googleDrive.js # Google Drive OAuth route
│ ├── googlePhotos.js # Google Photos OAuth route
│ ├── googleBusiness.js # Google My Business OAuth route
│ └── snapchat.js # Snapchat OAuth route
│
│ # Utility/Proxy routes
│ ├── logodev.js # LogoDev (proxy, not OAuth)
│ └── clearbit.js # Clearbit (proxy, not OAuth)
│
├── services/
│ ├── tokenService.js # Refresh token logic
│ └── sessionService.js # Handles user sessions
├── middlewares/
│ └── authMiddleware.js # Auth validation
├── utils/
│ └── oauthUtils.js # Helpers (scopes, URLs, etc.)
├── .env # Credentials and config
├── index.js # Main entry point
├── package.json
└── README.md

markdown
Copy
Edit

## 🛠️ Tech Stack

- Node.js
- Express.js
- Passport.js
- Custom OAuth integrations
- dotenv for secure config
- Cookie/session management
