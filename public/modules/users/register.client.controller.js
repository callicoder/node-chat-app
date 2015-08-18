'use strict';
angular.module('chatApp')
.controller('registerController', ['$scope', 'security', '$state', function($scope, security, $state){
	$scope.user = {};

	$scope.register = function() {
		var passwordHash = CryptoJS.MD5($scope.user.password).toString();		
		$scope.user.password = passwordHash;
		security.register($scope.user)
		.success(function(data){
			console.log(data);
			$state.go('home.chat');
		}).error(function(err){
			console.log(err);
			Materialize.toast('There was some error while registering: ' + err.message, 4000); 
		});
	};

}]);
