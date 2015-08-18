'use strict';
angular.module('chatApp')
.controller('headerController', ['$scope', 'security', function($scope, security){
    $scope.user = security.currentUser.username;

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
