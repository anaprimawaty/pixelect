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

/* POST get presigned url
 * response -> url/error
 */
router.post('/create', function(req,res) {
  var s3 = req.app.get('s3');
  var session = req.app.get('session')
  var filename = get_unique_filename(session.facebookId);
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

/* POST add photo to database
 * body -> {url, groupId}
 * response -> success/error
 */
router.post('/confirm', function(req, res) {
  var models = req.app.get('models');
  var session = req.app.get('session')
  models.User.findOne({
    where: {
      facebookId: session.facebookId
    }
  })
  .then(user => {
    models.Photo.create({
      link: req.body['link'],
      userId: user.get('id'),
      groupId: req.body['groupId']
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

/* POST delete specific photo with photoId
 * params -> photoId
 * response -> success/error
 */
router.post('/:photoId/delete', function(req, res){
  var models = req.app.get('models');
  var session = req.app.get('session');
  models.User.findOne({
      where: {
        facebookId: session.facebookId
      }
  }).then(user => {
      models.Photo.findById(req.params.photoId)
      .then(function(photo) {
        if(photo.userId == user.id){
          photo.destroy()
          .then(()=>{
            res.send('photo deleted')
          })
          .catch((e) => {
            console.log(e);
            res.send("Error deleting photo");
          })
        }
        else
          res.send("Error deleting photo");
      })
      .catch((e) => {
        console.log(e);
        res.send("photo does not exist");
      });
    })
})

module.exports = router;