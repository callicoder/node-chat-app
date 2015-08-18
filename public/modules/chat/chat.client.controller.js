'use strict';

angular.module('chatApp')
.controller('chatController', ['$scope', 'Socket', 'security', '$state', function($scope, Socket, security, $state){
	if(!security.currentUser) {
		$state.go('welcome.login');
	}

	$scope.messages = [];
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
