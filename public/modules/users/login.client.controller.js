'use strict';

angular.module('chatApp')
.controller('loginController', ['$scope', 'security', '$state', function($scope, security, $state){
	if(security.currentUser) {
		$state.go('home.chat');
	}

	$scope.user = {};

	$scope.login = function() {
		var passwordHash = CryptoJS.MD5($scope.user.password).toString();
		$scope.user.password = passwordHash;
		security.login($scope.user)
		.success(function(data){
			console.log(data);
			$state.go('home.chat'); 
		}).error(function(err){
			console.log(err);
			Materialize.toast('Wrong Credentials', 4000);
		});
	};
}]);
