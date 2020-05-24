/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  const testThread = "NewThread" + Math.floor(Math.random()*1000000);
  let testThread1Id;
  let testThread2Id;
  let testReplyId;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('create 2 new threads', (done) => {
        chai.request(server)
        .post('/api/threads/test')
        .send({text: testThread, delete_password: 'password'})
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post('/api/threads/test')
        .send({text: testThread, delete_password: 'password'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('most recent 10 threads with most recent 3 replies each', (done) => {
        chai.request(server)
        .get('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'threads are not an array');
          assert.isBelow(res.body.length, 11);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'text');
          testThread1Id = res.body[0]._id;
          testThread2Id = res.body[1]._id;
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'replies');
          assert.isArray(res.body[0].replies, 'replies are not an array');
          assert.isBelow(res.body[0].replies.length, 4);
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          done();
        })
      });
      
    });
    
    suite('DELETE', function() {
      
      test('delete thread: valid password', (done) => {
        chai.request(server)
        .delete('/api/threads/test')
        .send({ thread_id: testThread1Id, delete_password: 'password' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
      });
      
      test('delete thread: invalid password', (done) => {
        chai.request(server)
        .delete('/api/threads/test')
        .send({ thread_id: testThread2Id, delete_password: 'incorrect'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        })
      });
      
    });
    
    suite('PUT', function() {
      
      test('report thread', (done) => {
        chai.request(server)
        .put('/api/threads/test')
        .send({ report_id: testThread2Id })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
      }); 
      
    });
    
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('create a new reply', (done) => {
        chai.request(server)
        .post('/api/replies/test')
        .send({ thread_id: testThread2Id, text: 'a new reply', delete_password: 'password' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        })
      });
      
    });
    
    suite('GET', function() {
      
      test('get all replies for 1 thread', (done) => {
        chai.request(server)
        .get('/api/replies/test')
        .query({ thread_id: testThread2Id })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'delete_password');
          assert.property(res.body, 'reported');
          assert.property(res.body, 'text');
          assert.isArray(res.body.replies, 'replies are not an array');
          assert.equal(res.body.replies[res.body.replies.length - 1].text, 'a new reply');
          testReplyId = res.body.replies[res.body.replies.length - 1]._id;
          assert.notProperty(res.body.replies[0], 'reported');
          assert.notProperty(res.body.replies[0], 'delete_password');
          done();
        })
      });
      
    });
    
    suite('PUT', function() {
      
      test('report thread', (done) => {
        chai.request(server)
        .put('/api/replies/test')
        .send({ thread_id: testThread2Id, reply_id: testReplyId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
      }); 
      
    });
    
    suite('DELETE', function() {
      
      test('delete: invalid password', (done) => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({ thread_id: testThread2Id, reply_id: testReplyId, delete_password: 'incorrect' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        })
      });
      
      test('delete: valid password', (done) => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({ thread_id: testThread2Id, reply_id: testReplyId, delete_password: 'password' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
      });
      
    });
    
  });

});
