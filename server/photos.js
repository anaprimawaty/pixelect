var express = require('express');
var router = express.Router();
var crypto = require('crypto');

function get_unique_filename(id) {
  var data = new Date() + id;
  var filename = crypto.createHash('md5').update(data).digest('hex');
  return filename
}

// TODO: Fix route and fix to post request
// TODO: Fix req.body
router.post('/create', function(req,res) {
  var s3 = req.app.get('s3');
  var filename = get_unique_filename(req.body['facebookId']);
  s3.presignedPutObject('pixelectstaging', filename, 1000, function(e, presignedUrl) {
    if (e) {
      console.log(e);
      res.send("Error generating presigned url");
    } else {
      res.send(presignedUrl);
    }
  });
});

// TODO: Fix route and fix to post request
// TODO: Fix req.body
router.post('/confirm', function(req, res) {
  var models = req.app.get('models');
  var session = req.app.get('session');
  models.User.findOne({
    where: {
      facebookId: session.facebookId
    }
  })
  .then(user => {
    models.Photo.create({
      link: req.body['link'],
      userId: user.get('id'),
      groupId: req.body['groupid']
    })
    .then(() => {
      res.send("Success");
    })
    .catch((e) => {
      console.log(e);
      res.send("Error");
    });
  })
  .catch(e => {
    console.log(e);
    res.send("Cannot find User with facebookId");
  });
});

module.exports = router;