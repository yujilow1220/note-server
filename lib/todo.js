'use strict';
const crypto = require('crypto');
module.exports.env = process.env;

const Redmine = require('node-redmine');
// const hostname = process.env.TODO_HOST;
const hostname = "http://redmine";
const db = require('./db');
const self = require('./todo');
const port = 3000;

const config = {
  apiKey: process.env.TODO_APIKEY
};

const redmine = new Redmine(hostname, config, port);

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
  getProjectByName(issue.project,function(project){
    //見つけ出したproject宛に実際にPostする
    const redmine_issue = {
      "issue":{
        "project_id":project.id,
        "subject":issue.title,
        "description":issue.content
      }
    };
    console.log(redmine_issue);
    redmine.create_issue(redmine_issue, function(err, data){
      if(err)throw err;
      console.log(data);
    });
  });
}


function getProjectByName(name,callback){
  //projectを見つけるのと作る
  var self = {};
  redmine.projects({}, function(err, data){
    if(err)throw err;
    var filter = function(e){return e.name === name};

    if(data.projects.length === 0 || data.projects.filter(filter).length === 0){
      makeProject(name, callback);
    }
    else{
      const project = data.projects.filter(filter)[0];
      callback(project);
    }
  });
}

function makeProject(name, callback){
  const sha512 = crypto.createHash('sha512');
  sha512.update(Date.now().toString());
  const identifier = sha512.digest('hex').slice(0,5);
  const project = {
    "project":{
      "name":name,
      "identifier":identifier
    }
  }
  redmine.create_project(project, function(err, project){
    if(err)throw err;
    console.log("created project.");
    console.log(project);
    callback(project.project);
  });
}
