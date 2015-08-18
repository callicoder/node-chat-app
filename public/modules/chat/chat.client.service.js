'use strict';
angular.module('chatApp')
.factory('Socket', ['$timeout', 'security', '$state', function($timeout, security, $state){

    console.log(security.currentUser);

	if(security.currentUser) {
		this.socket = io();
	} else {
        console.log(security.currentUser);
		$state.go('login');
	}

	// Wrap the Socket.io 'on' method
    this.on = function(eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function(data) {
                $timeout(function() {
                    callback(data);
                });
            });
        }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function(eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function(eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };

    return this;
}]);
