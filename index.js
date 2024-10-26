require("dotenv").config()

// Packages
const express = require("express")
const session = require('express-session');
const passport = require("passport")
const cors = require('cors');
const cookieParser = require('cookie-parser')

// Services
const connectDB = require('./services/service.db.js')
require("./services/service.passport.js")

// Routers
const appRouter = require("./routers/router.app.js")

const app = express()

app.use(session({
  secret: process.env.SessionSecret, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST','OPTIONS'],
  allowedHeaders: '*'
}));

app.options('*', cors());

app.use(express.json());
app.use(cookieParser())


app.use(passport.initialize());
app.use(passport.session());

app.use("/",(req,res,next)=>{
  if(process.env.NODE_ENV=="DEVELOPMENT")
  console.log(req.session,req.params,req.body,req.method,req.headers,req.path)
  next()
},appRouter)


connectDB();

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Listening to port ",process.env.PORT || 3000)
})
