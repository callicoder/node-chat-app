'use strict';
angular.module('materialApp')
.factory('security', ['$http', '$window', function($http, $window) {
	var service = {
		currentUser: $window.user,

		login: function(user) {
			return $http.post('/auth/signin', user)
					.success(function(data){
						service.currentUser = data;
					});
		},

		register: function(user) {
			return $http.post('/auth/signup', user)
					.success(function(data){
						service.currentUser = data;
					});
		}
	};
	return service;
}]);
