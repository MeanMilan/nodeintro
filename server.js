'use strict';


// require the packages we need
var Hapi = require('hapi');
var server = new Hapi.Server();
var path = require('path');

var P = require('bluebird');
var _ = require('lodash');

var db = P.promisifyAll(require('./database'));
var Joi = require('joi');
var Boom = require('boom');

var PORT = 3000;
var HOST = 'mean.link-me.it';

var Inert = require('inert');

server.connection({
  host: HOST,
  port: PORT
});

server.register([
  Inert
],
function(err){
  if(err){
    //TODO BONUS errors should be logged
  }
});



const io = require('socket.io').listen(server.listener);


/**
 * Serve the client
 */
server.route({
  method: 'GET',
  path: '/{file*}',
  handler: {
    directory: {
      index: 'index.html',
      path: path.join(__dirname, 'static/' )
    }
  }
});

var exerciseModel = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required()
});

server.route({
  method: 'POST',
  path: '/api/exercise',
  config: { validate: {payload: exerciseModel} },
  handler: function(request, reply){

    const event = _.extend(
      request.payload, {timestamp: new Date().getTime() }
    );
    
    io.emit('submission', event);

    db.insert(
      event,
      function(err, res){

        if(err){
          return reply(Boom.wrap(err, 500));
        }

        return reply(res);
      }
    );
  }
});



/**
 * Orders exercises grouped by name, by the number of completed exercises
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
function completedExercises(user){
  return -user.exercises.length;
}

server.route({
  method: 'GET',
  path: '/api/ranking',
  handler: function(request, reply){

    io.emit('prova', {a: 'b'});

    db.find({}, function(err, res){

      if(err){
        return reply(Boom.wrap(err, 500));
      }

      res.toArray((err, arr) => {

        if(err){
          return reply(Boom.wrap(err, 500));
        }

        const val = _.chain(arr)
        .groupBy('username')
        .map((item) => {
          return {
            username: item[0].username,
            exercises: _.map(item, (ex) =>
              { return {'timestamp': ex.timestamp, 'name': ex.name} }
            )
          }
          return item
        })
        .sortBy(completedExercises)
        .value();

        return reply(val);
      });
    });
  }
});

server.start(function(){
  console.log('I live again - on '+ HOST +':'+ PORT);
});

module.exports = server;
