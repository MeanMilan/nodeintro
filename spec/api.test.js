'use strict';

var expect = require('chai').expect;
var P = require('bluebird');
var db = P.promisifyAll(require('../database'));
var server = require('../server');

function inject(options) {
  return new Promise((resolve)=> { server.inject(options, resolve)})
}

describe('the insertion route', function() {

  beforeEach( P.coroutine(function*(){

    yield db.removeAsync({});
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'cane', name: 'roba che scotta'}} );
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'gatto', name: 'roba che scotta'}} );
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'capra', name: 'roba che scotta'}} );
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'capra', name: 'roba molto molto hard'}} );

  }));

  it('inserts completed exercises with a timestamp', (done) => {
    db.find({}, function(err, res){

      expect(err).to.be.null;
      res.toArray((err, res)=> {

        expect(res.length).to.equal(4)
        done()
      });
    })
  });

  describe('the get route', ()=> {
    it('gets completion events grouped by user', P.coroutine(function*(){
      const res = yield inject({ method: 'GET', url: '/api/ranking'})
      console.log(res.payload)
    }));
  });

});
