'use strict';

angular.module('testApp')
    .factory('Canvas', function () {

        var ctx;
        var element;

        function Canvas(element) {
            this.element;
            this.ctx = element.getContext('2d');
        }

        Canvas.prototype = {
            drawPolygon: function(p) {
                var bbox = p.bBox();
                
                this.ctx.beginPath();
                this.ctx.strokeStyle=p.color;
                this.ctx.lineWidth=p.strokeWeight;
                this.ctx.fillStyle = "white";
                this.ctx.lineJoin = "round";
                for (var i = 0; i < p.points.length; i++) {
                    if (i == 0) 
                        this.ctx.moveTo(p.points[i][0], p.points[i][1]);
                    else 
                        this.ctx.lineTo(p.points[i][0], p.points[i][1]);
                }
                this.ctx.closePath();
                this.ctx.fillStyle=this.gradient;
                this.ctx.fill();
                this.ctx.stroke();
            }
        }

        return Canvas;
    });
