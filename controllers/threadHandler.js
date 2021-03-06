'use strict';

const MongoClient = require('mongodb').MongoClient;
const CONNECTION_STRING = process.env.DB;
const ObjectId = require('mongodb').ObjectId;

function ThreadHandler() {
  
  this.createThread = (text, delete_password, callback, board) => {
    //returns document if a document is found or new doc if one is inserted
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        //console.log('successful database connection');
        db.collection(board).insertOne({
              text: text,
              created_on: new Date,
              bumped_on: new Date,
              reported: false,
              delete_password: delete_password,
              replies: [] },
          (err, data) => {
            if(err) console.log(err);
            //console.log(data.ops);
            callback(data.ops);
            }
        );
      }
    })
  };
  
  this.displayThreads = (callback, board) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        //console.log('successful database connection');
        db.collection(board)
          .find()
          .sort({ bumped_on: -1 })
          .toArray((err, data) => {
            if(err) console.log(err);
            const result = data.slice(0, 10);
            callback(result);
            }
          );
      }
    })
  }
  
  this.deleteThread = (thread_id, delete_password, callback, board) => {
    //returns original document if one is deleted
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        //console.log('successful database connection');
        db.collection(board).findOneAndDelete({ _id: new ObjectId(thread_id), delete_password: delete_password }, (err, data) => {
          if(err) console.log(err);
          const result = (data.value === null) ? false : true;
          callback(result);
        })
      }
    }) 
  };
  
  this.reportThread = (thread_id, callback, board) => {
       //returns updated document or {} if none is found
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('anon-message-board');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        //console.log('successful database connection');
        db.collection(board).findOneAndUpdate(
          { _id: new ObjectId(thread_id) },
          { $set: { reported: true } },
          (err, data) => {
            if(err) console.log(err);
            //console.log(data.value);
            callback(data.value);
          }
        );
      }
    })
  };
  
}

module.exports = ThreadHandler;