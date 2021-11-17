// core module
const express = require('express')
// third party module
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
// user module
const auth = require('./auth')
const api = require('./exercise')

// define
const app = express()
const port = 3000

// Middleware
app.use(morgan('dev'))
app.use(
  '/',
  express.urlencoded({
    extended: true,
  })
)

// Request
app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: __dirname })
})

app.post('/login', (req, res) => {
  const payload = {
    name: 'rama',
    scopes: ['user:edit'],
  }
  const token = jwt.sign(payload, '/.,ladlpawd!@#^#AF!$@#%^&')
  res.send(`${token} - ${req.headers.authorization}`)
})

app.get('/user', (req, res) => {
  res.send(api.getUser())
  res.end()
})

app.get('/user/search', (req, res) => {
  let { name, age } = req.query
  if (req.query) {
    res.send(api.getUser(name, age))
  } else {
    res.send('Hello people')
  }
  res.end()
})

app.post('/user/add', (req, res) => {
  let { name, age } = req.body
  if (Object.keys(req.body).length > 0) {
    api.addUser(name, age)
    res.send('User created')
  } else {
    res.send('No data to add')
  }
  res.end()
})

app.listen(port, () => {
  console.log(`listening to http://127.0.0.1:${port}/`)
})
