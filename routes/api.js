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
    const board = req.params.board;
    const text = req.body.text;
    const delete_password = req.body.delete_password;
    const callback = (data) => {
      //if (data.delete_password !== delete_password) res.send("redirecting to a pre-existing thread");
      res.redirect(`/b/${board}/${data._id}`);
    }
    updateThread.createThread(text, delete_password, callback, board);
    })
  
    .get((req, res) => {
    const board = req.params.board;
    const callback = (data) => {
      //filter out delete_password and reported fields as well as only top 3 replies
    };
    updateThread.displayThreads(callback, board);
    })
  
    .delete((req, res) => {
    const board = req.params.board;
    const thread_id = req.params.thread_id;
    const delete_password = req.params.delete_password;
    const callback = (data) => {
      data.value ? res.send('success') : res.text('incorrect password');
    };
    
    updateThread.deleteThread(thread_id, delete_password, callback, board);
    })
  
    .put((req, res) => {
    const board = req.params.board;
    const thread_id = req.params.thread_id;
    const callback = (data) => {
      if (data) res.send('success');
    };
    updateThread.reportThread = (thread_id, callback, board);
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
