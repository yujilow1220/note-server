var assert = require('assert');
var todo = require('../lib/todo');

describe('env', function () {
    it('can access redmine host', function(){

    });

    it('can create a project with specified name', function(){
      
    });

    it('can find a todo in post', function(){
      var post = require('./post.json');
      var issue = todo.post2issue(post);
      assert.equal(issue.title, 'これを明日までにやる');
      assert.equal(issue.content, 'これとはこれのこと');
      assert.equal(issue.project, 'あれ');
    })

    it('can delete a project with no issue', function(){

    })
});
