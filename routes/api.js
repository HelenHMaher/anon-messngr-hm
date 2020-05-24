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
const ReplyHandler = require('../controllers/replyHandler.js');




module.exports = function (app) {
  
  const updateThread = new ThreadHandler();
  const updateReply = new ReplyHandler();
  
  
  
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
          thread.replycount = thread.replies.length;
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
        data ? res.send('success') : res.send('incorrect password');
        }
      updateThread.deleteThread(thread_id, delete_password, callback, board);
    })
  
    .put((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.report_id;
      const callback = (data) => {
        //console.log(data);
        data ? res.send('success') : res.send('there was an error');
        };
      //console.log(board + " " + thread_id);
      updateThread.reportThread(thread_id, callback, board);
    });
  
    
  app.route('/api/replies/:board')
  
    .post((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const text = req.body.text;
      const delete_password = req.body.delete_password;
      const callback = (data) => {
        //console.log(data.value);
        res.redirect(`/b/${board}/${thread_id}/`);
      }
      //console.log(board + thread_id + text + delete_password);
      updateReply.createReply(board, thread_id, callback, text, delete_password);
    })
  
    .get((req, res) => {
      const board = req.params.board;
      const thread_id =  req.query.thread_id;
      const callback = (data) => {
        data.replies.map(reply => {
          delete reply.delete_password;
          delete reply.reported;
        })
        res.send(data);
      }
      updateReply.displayReply(board, thread_id, callback);
    })
  
    .delete((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;
      const delete_password = req.body.delete_password;
      const callback = (data) => {
        (data) ? res.send('success') : res.send('incorrect password');
      }
      updateReply.deleteReply(board, thread_id, callback, reply_id, delete_password);
    })
  
    .put((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;
      const callback = (data) => {
        //console.log(data._id);
        data ? res.send('success') : res.send('there was an error');
      }
      updateReply.reportReply(board, thread_id, callback, reply_id);
    });

};
