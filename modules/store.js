const fs = require('fs')
const path = require('path')


module.exports = {
  getUsers: function () {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, 'users.json'), (err, data) => {
        if (err) return reject(err)
        resolve(JSON.parse(data))
      });
    })
  },
  setUsers: function (users) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users), function(err) {
        if (err) return reject(err)
        resolve(true)
      });
    })
  }
}
