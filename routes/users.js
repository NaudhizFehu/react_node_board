var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"message" : "node get success"});
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send({"message" : "node post success"});
});

module.exports = router;
