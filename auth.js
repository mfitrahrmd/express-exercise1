const jwt = require('jsonwebtoken')

module.exports = function () {
  return (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (!token) {
      return res.status(403).send('Forbidden')
    } else {
      jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
          console.log('JWT error,', err)
          return res.status(401).send('Forbidden')
        }
        next()
      })
    }
  }
}
