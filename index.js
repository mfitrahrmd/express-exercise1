// SESSION
let session

// core module
const express = require("express")
const fs = require("fs")
// third party module
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const ejs = require("ejs")
const expressSession = require("express-session")
const fileStore = require("session-file-store")(expressSession)
const mongoStore = require("connect-mongo")
const morgan = require("morgan")
require("dotenv").config()
// user module
const auth = require("./auth")
const api = require("./exercise")

// define
const app = express()

// Middleware
app.use(morgan("dev"))
app.use("/user", auth())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  expressSession({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: "mongodb://localhost:27017/auth",
    }),
  })
)

app.set("view engine", "ejs")

// Request
app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", (req, res) => {
  const { username, password } = req.body
  if (username != "admin") return res.send("username not found")
  if (password != "ggwp") return res.send("wrong password")
  req.session.username = username
  res.redirect("/admin")
})

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err)
    return
  })
  res.redirect("/login")
})

app.get(
  "/admin",
  (req, res, next) => {
    console.log(req.session.username)
    if (req.session.username != "admin") return res.status(401).send("Unauthorize")
    next()
  },
  (req, res) => {
    res.send(`Welcome, ${req.session.username}`)
  }
)

app.listen(process.env.PORT, () => {
  console.log(`listening to http://127.0.0.1:${process.env.PORT}/`)
})
