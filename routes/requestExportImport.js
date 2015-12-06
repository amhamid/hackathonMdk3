var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('request', { title: 'New Request' });
});

module.exports = router;
