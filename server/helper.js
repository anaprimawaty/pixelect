module.exports = {
  getHash: function(id) {
    var data = new Date() + id;
    var hash = require('crypto').createHash('md5').update(data).digest('hex');
    return hash
  },

  getUserId: function(models, facebookId) {
    models.User.findOne({
      where: { facebookId: facebookId }
    })
    .then(user => {
      return user.get('id');
    })
    .catch(e => {
      console.log("Error finding user with facebookId=" + facebookId + ": " + e);
      throw "Error finding user with facebookId=" + facebookId;
    });
  },

  getGroupId: function(models, groupHash) {
    models.Group.findOne({
      where: { hash: groupHash }
    })
    .then(group => {
      return group.get('id');
    })
    .catch(e => {
      console.log("Error finding group with groupHash=" + groupHash + ": " + e);
      throw "Error finding group with groupHash=" + groupHash;
    });
  },
}