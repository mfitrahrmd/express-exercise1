const fs = require('fs')

const fileBuffer = fs.readFileSync('./users.json', 'utf-8')
const users = JSON.parse(fileBuffer)

function getUser(name, age) {
  if (!name && !age) {
    return users
  } else if (name && age) {
    return users.filter((u) => u.name == name && u.age == age)
  } else {
    return users.filter((u) => u.name == name || u.age == age)
  }
}

function addUser(name, age) {
  const user = { id: users.length + 1, name, age }

  users.push(user)

  fs.writeFileSync('./users.json', JSON.stringify(users))
}

const api = { getUser, addUser }
module.exports = api
