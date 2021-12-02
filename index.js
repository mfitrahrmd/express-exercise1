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
const morgan = require("morgan")
// user module
const auth = require("./auth")
const api = require("./exercise")

// define
const app = express()
const port = 3000

// Middleware
app.use(morgan("dev"))
app.use("/user", auth())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cookieParser())
// app.use(
//   expressSession({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false,
//     store: new fileStore({}),
//   })
// )
app.use((req, res, next) => {
  next()
})

app.set("view engine", "ejs")

// Request
app.get("/", (req, res) => {
  res.render("index")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/process_login", (req, res) => {
  console.log(req.body)
  const { user, password } = req.body
  if (user === "rama" && password === "ggwp") {
    const payload = {}
    const option = {
      expiresIn: "30s",
      issuer: "pickurpage.com",
      audience: user,
    }
    const token = jwt.sign(payload, "secretkey", option)
    res.send(`${token}`)
  } else {
    return res.redirect("/login")
  }
})

app.get("/user", (req, res) => {
  res.send(api.getUser())
  res.end()
})

app.get("/user/search", (req, res) => {
  let { name, age } = req.query
  if (req.query) {
    res.send(api.getUser(name, age))
  } else {
    res.send("Hello people")
  }
  res.end()
})

app.post("/user/add", (req, res) => {
  let { name, age } = req.body
  if (Object.keys(req.body).length > 0) {
    api.addUser(name, age)
    res.send("User created")
  } else {
    res.send("No data to add")
  }
  res.end()
})

app.listen(port, () => {
  console.log(`listening to http://127.0.0.1:${port}/`)
})
