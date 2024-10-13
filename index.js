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
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cors({
  origin: ['http://localhost:5173','https://localhost:5173','https://localhost:5173/chat'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(cookieParser())


app.use(passport.initialize());
app.use(passport.session());

app.use("/",(req,res,next)=>{
  console.log(req.method,req.path,req.query,req.session)
  next()
},appRouter)


connectDB();

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Listening to port ",process.env.PORT || 3000)
})
