const jwt = require('jsonwebtoken')

module.exports = function () {
  return (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
      return res.status(403).send('Forbidden')
    } else {
      next()
    }
  }
}
