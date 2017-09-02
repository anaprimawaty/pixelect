module.exports = {
  log: function(source, msg) {
    var date = new Date().toUTCString()
    console.log("\n[" + date + "]" + source + " " + msg + "\n")
  },

  success: function() {
    return JSON.stringify({'Success':''})
  },

  error: function(e) {
    return JSON.stringify({'Error':e})
  },

  getHash: function(id) {
    var data = new Date() + id;
    var hash = require('crypto').createHash('md5').update(data).digest('hex');
    return hash
  },

  getUser: function(models, facebookId) {
    return new Promise(function(resolve, reject) {
      models.User.findOne({
        where: { facebookId: facebookId }
      })
      .then(user => {
        if (user) {
          resolve(user)
        } else {
          reject('Error: No User with facebookId:' + facebookId)
        }
      })
    })
  },

  getGroup: function(models, groupHash) {
    return new Promise(function(resolve, reject) {
      models.Group.findOne({
        where: { hash: groupHash }
      })
      .then(group => {
        if (group) {
          resolve(group)
        } else {
          reject('Error: No Group with hash:' + groupHash)
        }
      })
    })
  },
}