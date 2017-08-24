var express = require('express');
var router = express.Router();

// TODO: Fix 'testing'. Unique filename required
// TODO: Fix route
// TODO: Fix userId and groupId
// TODO: Fix to post
router.get('/:groupid', function(req,res) {
  var models = req.app.get('models');
  var s3 = req.app.get('s3');
  var presignedUrl = s3.presignedPutObject('pixelectstaging', 'testing', 1000, function(e, presignedUrl) {
    if (e) {
      console.log(e);
      res.send("Error");
    } else {
      models.Photo.create({
        link: presignedUrl,
        userId: 1,
        groupId: req.params.groupid
      }).then(() => {
        res.send(presignedUrl);
      }).catch((e) => {
        console.log(e);
        res.send("Error");
      });
    }
  });
});

module.exports = router;