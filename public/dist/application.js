'use strict';

angular.module('materialApp', [
    'ui.router', 
    'ngAnimate',
    'ngFileUpload'
]);

'use strict';

angular.module('materialApp')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('welcome', {
        abstract: true,
        templateUrl: 'modules/common/welcome.client.view.html',        
    })
    .state('welcome.branding', {
        url: '/',
        templateUrl: 'modules/common/branding.client.view.html',
    })
    .state('welcome.login', {
        url: '/login',
        templateUrl: 'modules/users/login.client.view.html',
        controller: 'loginController',
        data: {
            contentClass: 'login-content'
        }
    })
    .state('welcome.register', {
        url: '/register',
        templateUrl: 'modules/users/register.client.view.html',
        controller: 'registerController',
        data: {
            contentClass: 'register-content'
        }
    })
    .state('home', {
        abstract: true,
        templateUrl: 'modules/home/home.client.view.html',
        controller: 'homeController'
    })
    .state('home.files', {
        url: '/files',
        templateUrl: 'modules/files/files.client.view.html',
        controller: 'filesController'
    })
    .state('home.listFiles', {
        url: '/files/list',
        templateUrl: 'modules/files/listFiles.client.view.html',
        controller: 'listFilesController'
    })
    
}]);


angular.module('materialApp')
.run(['$rootScope', function($rootScope) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if(toState.data && toState.data.contentClass) {
            $rootScope.contentClass = toState.data.contentClass;
        } else {
            $rootScope.contentClass = '';
        }
    });    
}]);

'use strict';

angular.module('materialApp')
.controller('chatController', ['$scope', 'Socket', function($scope, Socket){
	var socket = io();

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

	$scope.$on('$destroy', function() {
        Socket.removeListener('chatMessage');
    });
}]);

'use strict';
angular.module('materialApp')
.factory('Socket', ['$timeout', 'security', '$state', function($timeout, security, $state){

	if(security.currentUser) {
		this.socket = io();
	} else {
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

'use strict';
angular.module('materialApp')
.controller('headerController', ['$scope', 'security', function($scope, security){
    $scope.user = security.currentUser.email;

}])
.directive('profileToggle', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function(e){
                element.toggleClass('open');
                $('.profile-menu').toggleClass('open');
            });
        }
    };
})
.directive('materialNiceScroll', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).niceScroll({
        		cursorcolor: 'rgba(0, 0, 0, 0.4)',
        		cursorwidth: '6px',
        		cursorborder: 'none',
        		cursorborderradius: '0px'
    		});
		}
	};
})
.directive('materialSideNav', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).sideNav({
        		menuWidth: 250,
        		edge: attrs.edge
    		});
		}
	};
}).directive('materialCollapsible', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).collapsible();
		}
	};
}).directive('materialSlider', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).slider();
        }
    };
}).directive('materialTabs', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).tabs();
        }
    };
}).
directive('materialFileInput', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var path_input = $(element).find('input.file-path');
      		$(element).find('input[type="file"]').change(function () {
      			console.log($(this)[0]);
        		path_input.val($(this)[0].files[0].name);
        		path_input.trigger('change');
      		});
		}
	};
}).directive('materialSelect', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.material_select();
		}
	};
}).directive('materialDropdown', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.dropdown({
      			inDuration: 300,
      			outDuration: 225,
      			constrain_width: false, // Does not change width of dropdown to that of the activator
      			gutter: 0, // Spacing from edge
      			belowOrigin: true // Displays dropdown below the button
    		});
		}
	};
}).directive('inputField', ['$compile', '$timeout', function ($compile, $timeout) {
	return {
        restrict: 'C',
        link: function (scope, element,attrs) {
            	$timeout(function () {
                	Materialize.updateTextFields();

                	element.find('textarea, input').each(function (index, countable) {
                		countable = angular.element(countable);
                    	if (!countable.siblings('span[class="character-counter"]').length) {
                    		countable.characterCounter();
                    	}
                	});
         		});
        }
    };
 }]).directive('ngModel',['$timeout', function($timeout){
	return {
        restrict: 'A',
        priority: -1, // lower priority than built-in ng-model so it runs first
        link: function(scope, element, attr) {
            	scope.$watch(attr.ngModel,function(value){
                	$timeout(function () {
                        if (value){
                            element.trigger('change');
                        } else if(element.attr('placeholder') === undefined) {
                            if(!element.is(':focus'))
                            element.trigger('blur');
                        }
                    });
                });
        }
    };
}]);

'use strict';
angular.module('materialApp')
.controller('homeController', ['$scope', function($scope){

}]);

'use strict';

angular.module('materialApp')
.controller('loginController', ['$scope', 'security', '$state', function($scope, security, $state){
	$scope.user = {};

	$scope.login = function() {		
		security.login($scope.user)
		.success(function(data){
			console.log(data);
			$state.go('home.files');
			Materialize.toast('Welcome to MtaerialAdmin ', 4000); 
		}).error(function(err){
			console.log(err);
			Materialize.toast('Wrong Credentials', 4000);
		});
	};
}]);

'use strict';
angular.module('materialApp')
.controller('registerController', ['$scope', 'security', '$state', function($scope, security, $state){
	$scope.user = {};

	$scope.register = function() {
		security.register($scope.user)
		.success(function(data){
			console.log(data);
			Materialize.toast('Welcome to MtaerialAdmin ', 4000); 
			$state.go('home.files');
		}).error(function(err){
			console.log(err);
			Materialize.toast('There was some error while registering: ' + err.message, 4000); 
		});
	};

}]);

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
