var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/store', function(req, res, next){
  var posts = req.body.posts;
  db.sync(posts, function(){
      res.send("ok");
  });
});

router.get('/tags', function(req, res, next){
  db.Tag.find({}, {},{sort:{updatedAt:-1}}, function(err, docs){
    res.send(docs);
  });
});

module.exports = router;
