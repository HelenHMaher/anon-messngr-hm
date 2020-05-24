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
        res.redirect(`/b/${board}/`);
        }
      updateThread.createThread(text, delete_password, callback, board);
    })
  
    .get((req, res) => {
      const board = req.params.board;
      const callback = (data) => {
        data.map(thread => {
          delete thread.delete_password;
          delete thread.reported;
          thread.replies = thread.replies.slice(0, 3);
        })
        //console.log(data);
        res.send(data);
      };
      updateThread.displayThreads(callback, board);
    })
  
    .delete((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const delete_password = req.body.delete_password;
      const callback = (data) => {
        //console.log('_id: ' + thread_id + ' password: ' + delete_password);
        data.value ? res.send('success') : res.send('incorrect password');
        }
      updateThread.deleteThread(thread_id, delete_password, callback, board);
    })
  
    .put((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.report_id;
      const callback = (data) => {
        //console.log(data);
        res.send('success');
        };
      console.log(board + " " + thread_id);
      updateThread.reportThread(thread_id, callback, board);
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
