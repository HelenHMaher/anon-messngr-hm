'use strict';

const MongoClient = require('mongodb').MongoClient;
const CONNECTION_STRING = process.env.DB;
const ObjectId = require('mongodb').ObjectId;

function ReplyHandler() {
  
  this.createReply = (board, thread_id, callback, text, delete_password) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        console.log('successful database conneciton');
        db.collection(board).findOneAndUpdate(
          { _id: new ObjectId(thread_id) },
          { $push: { replies: 
                    {_id: new ObjectId(),
                      text: text,
                     created_on: new Date,
                     delete_password: delete_password,
                     reported: false} 
                   } },
          (err, data) => {
            if(err) console.log(err);
            callback(data);
          }
        )
      }
    })
  }
  
  this.displayReply = (board, thread_id, callback) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        console.log('successful database connection');
        db.collection(board)
          .find({ _id: new ObjectId(thread_id) })
          .toArray((err, data) => {
            if(err) console.log(err);
            const result = data[0];
            delete result.delete_password;
            delete result.reported;
            callback(result);
            }
          );
      }
    })
  }
  
  this.deleteReply = (board, thread_id, callback, reply_id, delete_password) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        console.log('successful database connection');
        db.collection(board).findOneAndUpdate(
          { _id: new ObjectId(thread_id),
          replies: { $elemMatch: { _id: new ObjectId(reply_id), delete_password: delete_password } } },
          { $set: { "replies.$.text": "[deleted]" } },
          (err, data) => {
            if(err) console.log(err);
            callback(data.value);
          }
        );
      }
    })
  }
  
  this.reportReply = (board, thread_id, callback, reply_id) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        console.log('successful database connection');
        db.collection(board).findOneAndUpdate(
          { _id: new ObjectId(thread_id),
          replies: { $elemMatch: { _id: new ObjectId(reply_id) } } },
          { $set: { "replies.$.reported": true } },
          (err, data) => {
            if(err) console.log(err);
            callback(data.value);
          }
        );
      }
    })
  }
  
}

module.exports = ReplyHandler;