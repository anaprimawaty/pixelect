var express = require('express');
var router = express.Router();

// TODO: Check User can vote for Photo
router.post('/', function(req,res) {
  var models = req.app.get('models');
  var userId = req.body['userId'];
  var photoId = req.body['photoId'];
  models.Vote.findOne({
    where: {
      userId: userId,
      photoId: photoId
    }
  })
  .then(vote => {
    // Vote exists
    vote.update({
      isValid: !vote.get('isValid')
    })
    .then(() => {
      res.send("Success");
    })
    .catch(e => {
      console.log(e);
      res.send("Error");
    });
  })
  .catch(e => {
    // Vote does not exist
    models.Vote.create({
      userId: userId,
      photoId: photoId
    })
    .then(() => {
      res.send("Success");
    })
    .catch(e => {
      console.log(e);
      res.send("Error");
    });
  });
});

module.exports = router;