'use strict';

angular.module('Ranking')
    .controller('UserCtrl', function($scope, User, _ , mySocket){

      $scope.users = [];
      $scope.users = User.query();

      mySocket.on('submission',function(submission){
        const user = _.find($scope.users, { username: submission.username });
        if(user){
          user.exercises.push({name: submission.name, timestamp: submission.timestamp})
        }
        else{
          $scope.users.push({
            username: submission.username,
            exercises: [
              {name: submission.name, timestamp: submission.timestamp}
            ]
          });
        }
      });
    });
