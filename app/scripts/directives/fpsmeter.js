'use strict';

angular.module('testApp')
.directive('fpsmeter', function () {
    return {
        templateUrl: 'views/fpsmeter.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs, $rootScope) {
            
        }, 
        controller: function ($scope, $rootScope) {
            $rootScope.$on('fps', function (evt, fps) {
                $scope.fps = fps|0;
            });
        }
    };
});
