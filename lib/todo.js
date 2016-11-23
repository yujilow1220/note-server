'use strict';
module.exports.env = process.env;

const Redmine = require('node-redmine');
const hostname = process.env.TODO_HOST;
const db = require('./db');

const config = {
  apiKey: process.env.TODO_APIKEY
};

const redmine = new Redmine(hostname, config);

module.exports.send = function(post){
  db.Tag.find({_id: post.tags}).then(function(tags){
    post.tags = tags;
    const issue = post2issue(post);
  });
}

module.exports.post2issue = function(post){
  var issue = {};
  var body = post.text;
  issue.project = post.tags[0].text;
  issue.title = body.split("\n\n")[0].split(":")[1];
  issue.content = body.split("\n\n")[1];
  return issue;
}
function post2issue(post){
  var issue = {};

  return issue;
}
