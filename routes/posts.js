"use strict";
var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  var start = req.query.start || 0;
  var tag = req.query.tag || 'root';
  db.Tag.findOne({text:tag},function(err,doc){
    db.Post.find({tags:doc}, null, {sort: {postedAt: -1}})
    .populate('tags')
    .exec(function(err,docs){
      res.send(docs);
    })
  });

});

router.get('/all/:num', function(req,res,next){
  var num = req.params['num'];
  db.Post.find({}, {}, {sort: {postedAt: -1}, limit:num*10}).populate('tags').exec(function(err, docs){
    fit_send(res, docs);
  })
});

router.get('/tag/:tag/:num', function(req, res, next){
  var tag = req.params['tag'];
  var num = req.params['num'] || 0;
  console.log(tag)
  db.Tag.findOne({text:tag}, {}, function(err,doc){
    console.log(doc)
    db.Post.find({tags:doc}, {},{sort: {postedAt: -1}, limit:num*10}).populate('tags').exec(function(err,docs){
      console.log('-------docs---------');
      console.log(docs);
      fit_send(res, docs);
    })
  })
});

router.post('/', function(req, res, next){
  var post = new db.Post;
  post.text = req.body.text;

  if(req.body.tag){
      db.Tag.findOne({text:req.body.tag},{},{},function(err,docs){
        //tagが存在しない場合
        if(!docs){
          var tag = new db.Tag;
          tag.text = req.body.tag;
          tag.updatedAt = Date.now();
          tag.save(function(err,tag){
            console.log(tag)
            post.tags.push(tag);
            post.save(function(err,data){
              console.log(data);
              res.send(data);
            })
          });
        }else{
          post.tags.push(docs);
          post.save(function(err,data){
            console.log(data);
            docs.updatedAt = Date.now();
            console.log(docs)
            docs.save();
            res.send(data);
          });
        }
      });
  }

  else {
    post.tags.push(db.root);
    post.save(function(err,data){
      console.log(data);
      res.send(data);
    });
  }
});

router.get('/test', function(req,res,next){
  // var post = new db.Post;
  // post.text = 'aaa';
  // post.save();
  db.Post.remove({}, {}, function(err,doc){
      res.send("ok");
  });

});

module.exports = router;
function fit_send(res, docs){
  if(docs.length > 10){
    var results = docs.slice(docs.length-11, docs.length-1);
  }else{
    var results = docs;
  }
  res.send(results);
}
