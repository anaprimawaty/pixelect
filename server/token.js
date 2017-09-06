var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
  res.send({ csrfToken: req.csrfToken() })
})

module.exports = router