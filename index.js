require("dotenv").config()

// Packages
const express = require("express")
const session = require('express-session');
const passport = require("passport")
const cors = require('cors');
const cookieParser = require('cookie-parser')

// Services
require("./services/passport.service.js")
require('./services/db.service.js')();

// Routers
const authRouter = require("./routers/auth.router.js")
const appRouter = require("./routers/apps.router.js")

const app = express()

app.use(session({
  secret: process.env.SessionSecret, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

//Debugging Middleware
app.use((req,res,next)=>{
  if(process.env.NODE_ENV=="DEVELOPMENT"){
    console.log(req.session,req.params,req.body,req.method,req.headers,req.url)
  }
  next();
})

//Routers
app.use("/v1/auth",authRouter)
app.use("/v1/apps",appRouter)

//Health Handeller.
app.get("/",(request,response) => {
  response.status(200).json({"message":"Health OK"})
})

//Catch All Handeller
app.use((req, res) => {
  res.status(404).json({"message":"Requested Endpoint does not exist"})
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Listening to port ",process.env.PORT || 3000)
})
