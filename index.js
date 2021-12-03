const mongoose = require("mongoose")
const express = require("express")
const express_session = require("express-session")
const MysqlStore = require("express-mysql-session")(express_session)
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const cookie_parser = require("cookie-parser")
const ejs = require("ejs")
const cors = require("cors")
const bcrypt = require("bcrypt")
const morgan = require("morgan")
require("dotenv").config()

// Model
const User = require("./models/user")

const app = express()

mongoose.connect("mongodb://localhost:27017/auth")

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookie_parser(process.env.SECRET_KEY))
app.use(
  express_session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username }, function (err, user) {
      if (err) return done(err)
      if (!user) return done(null, false, { message: "Incorrect username" })
      bcrypt.compare(password, user.password, function (err, res) {
        if (err) return done(err)
        if (res === false) return done(null, false, { message: "Incorrect password" })
        return done(null, user)
      })
    })
  })
)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect("/login")
}

app.get("/", isLoggedIn, (req, res) => {
  res.send(`Hello World <a href="/logout">Logout</a>`)
})

app.get(
  "/login",
  (req, res, next) => {
    if (!req.isAuthenticated()) return next()
    res.redirect("/")
  },
  (req, res) => {
    res.send(`<form action="/login" method="post">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>`)
  }
)

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login?error",
  })
)

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})

app.get("/add", (req, res) => {
  User.insertMany({ username: "ardi", password: bcrypt.hashSync("1234", 10) })
  res.end(console.log("registration done"))
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening to port ${process.env.PORT}`)
})
