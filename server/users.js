var express = require('express');
var router = express.Router();

router.get('/:userid', function(req, res) {
  var models = req.app.get('models');
  var userid = req.params.userid;
  var user = models.User
    .findById(userid)
    .then(user => {
      res.send('user first name ' + user.get('firstName'));
    });
});

module.exports = router;