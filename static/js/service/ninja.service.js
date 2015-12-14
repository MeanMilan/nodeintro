'use strict';

angular.module('Ranking')
.service('User',function($resource){
  var User = $resource('http://mean.link-me.it:3000/api/ranking');
  return User;
});
