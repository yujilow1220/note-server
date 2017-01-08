'use strict';
module.exports.env = process.env;

const Redmine = require('node-redmine');
const hostname = process.env.TODO_HOST || 'localhost:3000';
const db = require('./db');
const self = require('./todo');

const config = {
  apiKey: process.env.TODO_APIKEY
};

const redmine = new Redmine(hostname, config);

module.exports.send = function(post){
  db.Tag.find({_id: post.tags},{}).then(function(tags){
    post.tags = tags;
    const issue = self.post2issue(post);
    console.log("sending issue ↓");
    console.log(issue);
    sendToRedmine(issue);
  }).catch(function(e){
    throw e;
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


function sendToRedmine(issue){
  getProject(issue,function(project){
    //見つけ出したproject宛に実際にPostする
  });
}


function getProject(issue,callback){
  var project = {};
  //projectを見つけるのと作る
  callback(project);
}
