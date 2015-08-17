'use strict';
angular.module('materialApp')
.controller('registerController', ['$scope', 'security', '$state', function($scope, security, $state){
	$scope.user = {};

	$scope.register = function() {
		security.register($scope.user)
		.success(function(data){
			console.log(data);
			Materialize.toast('Welcome to MtaerialAdmin ', 4000); 
			$state.go('home.chat');
		}).error(function(err){
			console.log(err);
			Materialize.toast('There was some error while registering: ' + err.message, 4000); 
		});
	};

}]);
