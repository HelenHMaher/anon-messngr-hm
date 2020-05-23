/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ThreadHandler = require('../controllers/threadHandler.js');




module.exports = function (app) {
  
  const updateThread = new ThreadHandler();
  
  
  
  app.route('/api/threads/:board')
    .post((req, res) => {
    const text = req.params.text;
    const delete_password = req.params.delete_password;
    const callback = (data) => {
      if (data.delete_password !== delete_password) alert("redirecting to a pre-existing thread");
      res.redirect(`/${data.text}`);
    }
    updateThread.createThread(text, delete_password, callback);
    })
  
    .get((req, res) => {
    const callback = (data) => {
      //filter out delete_password and reported fields as well as only top 3 replies
    };
    updateThread.displayThreads(callback);
    })
  
    .delete((req, res) => {
    const thread_id = req.params.thread_id;
    const delete_password = req.params.delete_password;
    const callback = (data) => {
      data.value ? res.text('success') : res.text('incorrect password');
    };
    
    updateThread.deleteThread(thread_id, delete_password, callback);
    })
  
    .put((req, res) => {
    const thread_id = req.params.thread_id;
    const callback = (data) => {
      if (data) res.text('success');
    };
    updateThread.reportThread = (thread_id, callback);
    });
  
    
  app.route('/api/replies/:board')
    .post((req, res) => {
      
    })
    .get((req, res) => {
      
    })
    .delete((req, res) => {
    
    })
    .put((req, res) => {
    
    });

};
