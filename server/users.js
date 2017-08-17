var express = require('express');
var router = express.Router();

router.get('/:userid', function(req, res) {
	res.send("user " + req.params.userid);
});

module.exports = router;