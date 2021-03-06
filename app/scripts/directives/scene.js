'use strict';

angular.module('testApp')
.directive('scene', function () {
    return {
        template: '<canvas class="canvas" width="1920" height="1080"></canvas>',
        restrict: 'E',
        replace: true,
        link: function postLink(scope, element, attrs) {
            
        },
        controller: function ($scope, $interval, $element, Polygon, Canvas) {
            var polygons = [];
            
            var canvas = new Canvas($element[0]);
           
            $scope.drawPolygons = function() {
                //ctx.clearRect(0, 0, $element[0].width, $element[0].height);

                for (var i = 0; i < polygons.length; i++) {
                    canvas.drawPolygon(polygons[i]);
                }
            }
            var star = new Polygon([[350,75], [379,161], [469,161], [397,215], [423,301], [350,250], [277,301], [303,215], [231,161], [321,161]]);
            var rotation = true;
            var add = false;
            var count = 0;
            $scope.$on('testcountUpdate', function (evt, testconfig) {
                count = testconfig.count;
                rotation = testconfig.rotation;
                
                
                if (testconfig.count > polygons.length) {
                    add = true;
                } else if (testconfig.count < polygons.length) {
                    var diff = polygons.length - testconfig.count;
                    console.log('splicing ' + diff);
                    polygons.splice(-diff, diff);
                }
                
            });

            var c = 0;

            $interval(function () {
                if (c++ > 10000) return;

                if (polygons.length >= count) add = false;
                if (add) {
                    polygons.push(star.clone().scale(Math.random()*0.5));
                }
                for (var i = 0; i < polygons.length; i++) {
                    var p = polygons[i];
                    var direction = polygons[i].direction;
                    if (p.bBox().y+p.bBox().height > 1080) direction[1] = -(Math.random()*10|0); 
                    if (p.bBox().y < 0) direction[1] = (Math.random()*10|0);
                    if (p.bBox().x+p.bBox().width > 1920) direction[0] = -(Math.random()*10|0);
                    if (p.bBox().x < 0) direction[0] = (Math.random()*10|0);
                    if (rotation) 
                        p.move(direction[0], direction[1]).rotate(p.rotation);
                     else 
                        p.move(direction[0], direction[1]);
                    
                }

                
                    
                //p.rotate(10);
                //p.move(1,2);
                
            }, 1000/25);


            // The draw loop    
            var lastLoop = new Date;        
            var fps = 0;
            $interval(function () {
                var thisLoop = new Date;
                fps = 1000 / (thisLoop - lastLoop);
                lastLoop = thisLoop;
                canvas.ctx.clearRect(0, 0, $element[0].width, $element[0].height);
                $scope.drawPolygons(polygons);
            }, 1000/60);

            $interval(function() {

                $scope.$emit('fps', fps);
            }, 1000);
    
        }
    };
});
