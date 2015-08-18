'use strict';

angular.module('chatApp')
.controller('loginController', ['$scope', 'security', '$state', function($scope, security, $state){
	$scope.user = {};

	$scope.login = function() {
		var passwordHash = CryptoJS.MD5($scope.user.password);		
		$scope.user.password = passwordHash;
		security.login($scope.user)
		.success(function(data){
			console.log(data);
			$state.go('home.chat');
			Materialize.toast('Welcome to MtaerialAdmin ', 4000); 
		}).error(function(err){
			console.log(err);
			Materialize.toast('Wrong Credentials', 4000);
		});
	};
}]);
