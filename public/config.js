'use strict';

angular.module('chatApp')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/login');    

    $stateProvider
    .state('welcome', {
        abstract: true,
        templateUrl: 'modules/common/welcome.client.view.html',        
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
        templateUrl: 'modules/home/home.client.view.html'
    })
    .state('home.chat', {
        url: '/chat',
        templateUrl: 'modules/chat/chat.client.view.html',
        controller: 'chatController'
    });    
}]);


angular.module('chatApp')
.run(['$rootScope', 'security', '$state', function($rootScope, security, $state) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if(toState.data && toState.data.contentClass) {
            $rootScope.contentClass = toState.data.contentClass;
        } else {
            $rootScope.contentClass = '';
        }
    });    
}]);
