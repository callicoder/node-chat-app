'use strict';

angular.module('materialApp')
.controller('chatController', ['$scope', 'Socket', 'security', function($scope, Socket, security){
	$scope.messages = [];
	$scope.numUsers = 0;
	$scope.sendMessage = function() {
		console.log($scope.messageText);
		var message = {
			text: $scope.messageText
		};
    	Socket.emit('chatMessage', message);
    	$scope.messageText = '';
	};

	Socket.on('chatMessage', function(msg){
		$scope.messages.push(msg);
	});

	Socket.on('analytics', function(data){
		$scope.numUsers = data.numUsers;
	});

	$scope.$on('$destroy', function() {
        Socket.removeListener('chatMessage');
    });
}]);
