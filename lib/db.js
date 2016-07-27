var mongoose = require('mongoose');
var tags;
mongoose.connect('mongodb://localhost/test', function(){
  Tag.find({},{}, function(err,docs){
    module.exports.tags = docs;
    Tag.find({text:'root'},{},function(err,docs){
      if(docs.length === 0){
        var tag = new Tag;
        tag.text = 'root';
        tag.save(function(err,data){
          console.log('root tag created. id = ' + data._id);
          module.exports.root = data;
        });
      }else {
        Tag.findOne({text:'root'},{}, function(err, data){
          console.log(data);
          module.exports.root = data;
        });
      }
    });
  });
  console.log('ok');
});
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  text: String,
  postedAt: { type: Date, default: Date.now },
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
});

var TagSchema = new Schema({
  text: {type: String, index: { unique: true, dropDups: true }},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}
});

var Post = mongoose.model('Post', PostSchema);
var Tag = mongoose.model('Tag', TagSchema);

module.exports.Post = Post;
module.exports.Tag = Tag;


module.exports.sync = function(posts, callback){
  posts = posts.map(function(e){
    e.postedAt = new Date(e.postedAt);
    return e;
  })
  Post.create(posts, function(err, docs){
    console.log(docs);
    callback();
  });
}
