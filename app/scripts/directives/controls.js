'use strict';

angular.module('testApp')
  .directive('controls', function () {
    return {
      templateUrl: 'views/controls.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      }, 
      controller: function($scope, $rootScope) {

      	$scope.$watch('testcount', function() {
      		$rootScope.$broadcast('testcountUpdate', $scope.testcount);
      	})
      }
    };
  });
