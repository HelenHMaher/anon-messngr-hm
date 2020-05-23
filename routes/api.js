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


module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post((req, res) => {
    
    })
    .get((req, res) => {
    
    })
    .delete((req, res) => {
    
    })
    .put((req, res) => {
    
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
