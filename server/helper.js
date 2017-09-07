module.exports = {
  log: function(source, msg) {
    var date = new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"})
    console.log("\n[" + date + "]" + source + " " + msg + "\n")
  },

  success: function(msg) {
    return JSON.stringify({'Success':msg || ''})
  },

  error: function(e) {
    return JSON.stringify({'Error':e})
  },

  getHash: function() {
    return require('crypto').randomBytes(20).toString('hex');
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

  isAuthenticated: function(req, res, next) {
    var facebookId = req.session.facebookId

    req.app.get('models').User.findOne({
      where: { facebookId: facebookId }
    })
    .then(user => {
      if (user) {
        return next()
      } else {
        require('./helper').log('[isAuthenticated]['+req.originalUrl+']', 'Forbidden: Invalid facebookId:' + facebookId)
        res.status(403).send({'Forbidden':''})
      }
    })
  },

  hasAccess: function(req, res, next) {
    var models = req.app.get('models')
    var helper = require('./helper')
    var source = '[hasAccess]['+req.originalUrl+']'

    var userId = models.User
      .findOne({where: {facebookId: req.session.facebookId} })
      .then(user => {
        if (user) {
          return user.id
        } else {
          helper.log(source, 'Error: Invalid facebookId:' + req.session.facebookId)
          return 'NULL'
        }
      })

    var groupId = models.Group
      .findOne({ where: {$or: [{hash: req.body.groupHash}, {hash: req.params.groupHash}]} })
      .then(group => {
        if (group) {
          return group.id
        } else {
          helper.log(source, 'Error: Invalid groupHash:' + req.body.groupHash + ' OR ' + req.params.groupHash)
          return 'NULL'
        }
      })

    Promise.all([userId, groupId]).then(([userId, groupId]) => {
      models.UserGroup
      .findOne({where: {userId: userId, groupId: groupId} })
      .then(ug => {
        if (ug) {
          return next()
        } else {
          helper.log(source, 'Forbidden: userId:' + userId + ' cannot access groupId:' + groupId)
          res.status(403).send({'Forbidden':''})
        }
      })
    })
  },
}