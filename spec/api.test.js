'use strict';

var expect = require('chai').expect;
var P = require('bluebird');
var db = P.promisifyAll(require('../database').db);
var server = require('../server');

function inject(options) {
return new Promise((resolve)=> { server.inject(options, resolve)})
}

describe('the insertion route', function() {

beforeEach( P.coroutine(function*(){

  yield db.removeAsync({});

  //solo uno dovrebbe essere registrato per via dell'indice
  try {
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'cane', name: 'roba che scotta'}} );
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'cane', name: 'roba che scotta'}} );
    yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'cane', name: 'roba che scotta'}} );
  }
  catch(e){
    console.log(e);
  }


  yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'gatto', name: 'roba che scotta'}} );
  yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'capra', name: 'roba che scotta'}} );
  yield inject({ method: 'POST', url: '/api/exercise', payload: {username: 'capra', name: 'roba molto molto hard'}} );

}));

it('inserts completed exercises with a timestamp', (done) => {
  db.find({}, function(err, res){

    expect(err).to.be.null;
    res.toArray((err, res)=> {

      console.log(res)
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
