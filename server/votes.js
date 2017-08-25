var express = require('express');
var router = express.Router();

// TODO: Check User can vote for Photo
router.post('/', function(req,res) {
  var models = req.app.get('models');
  var photoId = req.body['photoId'];

  // Find User
  models.User.findOne({
    where: {
      facebookId: req.body['facebookId']
    }
  })
  .then(user => {
    // Create or update Vote
    models.Vote.findOne({
      where: {
        userId: user.get('id'),
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
        userId: user.id,
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
  })
  .catch(e => {
    console.log(e);
    res.send("Cannot find User with facebookId");
  });
});

module.exports = router;