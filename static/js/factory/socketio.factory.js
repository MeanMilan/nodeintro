'use strict';

angular.module('Ranking')
    .factory('mySocket', function ($window, socketFactory) {

      var myIoSocket = $window.io.connect('http://mean.link-me.it:3000');

      var mySocket = socketFactory({
        ioSocket: myIoSocket
      });

      window.onbeforeunload = function(){
        console.log('porcocane')
        myIoSocket.close();
      }
      return mySocket;
    });
