var Db = require('tingodb')().Db;
var path = require('path');

/**
 * TODO: We need to provide tingo db with a local path! to the db folder
 *
 * https://github.com/sergeyksv/tingodb
 * https://nodejs.org/api/path.html#path_path_join_path1_path2
 * https://nodejs.org/api/globals.html#globals_dirname
 */

//var dbPath = '?';
//
//

var db = null;
var dbPath = path.join(__dirname, 'db');
var db = new Db(dbPath, {});
var collection = db.collection('users');

exports.db = collection;

exports.plugin = (server, options, next) => {

  collection.createIndex({id: 1}, {unique: true}, function(err, index){

    if(err){
      return err;
    }

    server.db = db;
    next();
  })
}
exports.plugin.attributes = {
  name: 'db',
  version: '0.1.0'
}
