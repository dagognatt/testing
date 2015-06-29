'use strict';

angular.module('testApp')
.directive('scene', function () {
    return {
        template: '<canvas style="width: 100%; height: 100%" width="1920" height="1080"></canvas>',
        restrict: 'E',
        replace: true,
        link: function postLink(scope, element, attrs) {
            
        },
        controller: function ($scope, $interval, $element) {
            var polygons = [];
            var ctx = $element[0].getContext('2d');
            
            $scope.drawPolygon = function(matrix) {
                var vertices = matrix.valueOf();
                
                ctx.beginPath();
                for (var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    if (i === 0) {
                        ctx.moveTo(vertex[0], vertex[1]);
                    } else {
                        ctx.lineTo(vertex[0], vertex[1]);
                    }
                }
                ctx.closePath();
                ctx.stroke();
            }
            $scope.drawPolygons = function() {
                ctx.clearRect(0, 0, $element[0].width, $element[0].height);
                for (var i = 0; i < polygons.length; i++) {
                    $scope.drawPolygon(polygons[i]);
                }
            }

            $scope.getPolyMatrix = function(polygon) {
                var polyMatrix = [[],[]];
                for (var i = 0; i < polygon.length; i++) {
                    polyMatrix[0].push(polygon[i][0]);
                    polyMatrix[1].push(polygon[i][1]);
                }
                return math.matrix(polyMatrix);
            }
            $scope.getCentroid = function(polygonM) {
                var vertices = polygonM.valueOf();

                var y, x, f, point1, point2, area;
                x = y = 0;
                area = 0;
                for (var i = 0, j = vertices.length - 1; i < vertices.length; j=i,i++) {
                    point1 = vertices[i];
                    point2 = vertices[j];
                    

                    area += (point1[0] * point2[1]) - (point1[1] * point2[0]);

                    f = point1[0] * point2[1] - point2[0] * point1[1];

                    x += (point1[0] + point2[0]) * f;
                    y += (point1[1] + point2[1]) * f;
                }
                area /= 2;
                f = area * 6;
                return [x/f, y/f];
            }
            $scope.getArea = function(polygonM) {
                var vertices = polygonM.valueOf();
                var y, x, f, point1, point2, area;
                area = 0;
                for (var i = 0, j = vertices.length - 1; i < vertices.length; j=i,i++) {
                    point1 = vertices[i];
                    point2 = vertices[j];

                    area += point1[0] * point2[1];
                    area -= point1[1] * point2[0];
                }
                return area;
            }

            $scope.rotatePolygon = function(polygon, degree) {
                degree = degree * (Math.PI/180);
                var centroid = $scope.getCentroid(polygon);
                $scope.drawPixel(centroid[0], centroid[1]);
                
                polygon = polygon.map(function (value, index, matrix) {
                    //console.log(index + ': ' + value);
                    //console.log(index + ': ' + (value + centroid[index[1]]));
                    return value - centroid[index[1]];
                });
                //offsetM = math.add(polygon, centroid);
                //console.log(offsetM);
                var rotM = math.matrix([ 
                    [Math.cos(degree), -Math.sin(degree)],
                    [Math.sin(degree), Math.cos(degree)] 
                    ]);
                var rotatedM = math.multiply(polygon, rotM);
                //return rotatedM;
                return rotatedM.map(function (value, index, matrix) {
                    return value + centroid[index[1]];
                });
            }

            $scope.flipX = function(matrix, deg) {
                deg = deg * (Math.PI/180);
                var centroid = $scope.getCentroid(matrix);
                return matrix.map(function (value, index) {
                    if (index[1] === 0) {
                        if (value > centroid[0]) return value - (value-centroid[0])*Math.abs(Math.sin(deg));
                        else return value + (centroid[0]-value)*Math.abs(Math.sin(deg))
                    } else return value;
                });
            }

            $scope.drawPixel = function (x, y) {
                ctx.fillRect(x,y,1,1);
            }
            var star = math.matrix([[350,75], [379,161], [469,161], [397,215],
                    [423,301], [350,250], [277,301], [303,215],
                    [231,161], [321,161]]);
            polygons.push(star);
            
            polygons.push(star.map(function(value, index) {
                if (index[1] == 0) 
                    return value + 500;
                else return value;
            }));
            polygons.push(star.map(function(value, index) {
                if (index[1] == 0) 
                    return value + 500;
                else return value;
            }));


            var time = 0;
            
            $interval(function () {
                polygons[0] = $scope.rotatePolygon($scope.flipX(star, time+=2), time-=1);
                polygons[1] = $scope.rotatePolygon(polygons[1], 2);
                polygons[2] = $scope.flipX($scope.rotatePolygon(polygons[2], -3), 1);
                
            }, 1000/25);
            
            $interval(function () {
                $scope.drawPolygons(polygons);
            }, 1000/25);


            //polygons.push($scope.rotatePolygon(polygons[0], time+=5));
            
            //    $scope.drawPolygons(polygons);
            
            
    
        }
    };
});
