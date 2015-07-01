'use strict';

angular.module('testApp')
.factory('Polygon', function () {

    function Polygon(points) {
        this.matrix = math.matrix(points);
        this.points = points;
        this.direction = [Math.random()*5, Math.random()*10];
        this.rotation = Math.random()*2;
        this.color = '#5C5C99';
        this.strokeWeight = 2;
        
    }

    Polygon.prototype = {
        // Returns the total area (in pixels) of the polygon. 
        area: function() {
            if (this._area) return this._area;
            var y, x, p1, p2;
            var area = 0;
            for (var i =0, j = this.points.length -1; i < this.points.length; j=i, i++) {
                p1 = this.points[i];
                p2 = this.points[j]; 

                area += (p1[0] * p2[1]) - (p1[1] * p2[0]);
            }
            area /= 2;
            this._area = area;
            return this._area;
        },
        // Returns the closest "center" of the polygon, based on "mass". Its what we default to when rotate around 
        centroid: function(forceRecalc) {
            if (this._centroid && !forceRecalc) return this._centroid;
            var y = 0;
            var x = 0;
            var p1, p2, f;
            var area = this.area();
            for (var i =0, j = this.points.length -1; i < this.points.length; j=i, i++) {
                
                p1 = this.points[i];
                p2 = this.points[j]; 

                f = p1[0] * p2[1] - p2[0] * p1[1];

                x += (p1[0] + p2[0]) * f;
                y += (p1[1] + p2[1]) * f;
            }
            f = area * 6;
            this._centroid = [x/f, y/f]

            return this._centroid;
        },
        // Return this polygons' Bounding Box  x, y, width, height
        bBox: function() {
            if (this._bbox) {
                return this._bbox;
            }
            var minx=Infinity;
            var miny=Infinity;
            var maxx=-Infinity;
            var maxy=-Infinity;
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i][0] < minx) minx = this.points[i][0];
                if (this.points[i][1] < miny) miny = this.points[i][1];
                if (this.points[i][0] > maxx) maxx = this.points[i][0];
                if (this.points[i][1] > maxy) maxy = this.points[i][1];
            }
            this._bbox = {x: minx, y: miny, width: maxx-minx, height: maxy-miny};
            return this._bbox;
        },
        // Rotates this polygon around the point given in 'origo' which is a array [x, y] 
        rotate: function(degree, origo) {
            var rad = degree * (Math.PI/180);
            if (!origo) {
                origo = this.centroid();
            }
            
            // Move the polygon to the new origo (or centroid) before performing rotation. 
            var p = this.matrix.map(function (value, index) {
                return value - origo[index[1]];
            });

            // Rotation matrix
            var rotM = math.matrix([ 
                [Math.cos(rad), -Math.sin(rad)],
                [Math.sin(rad), Math.cos(rad)] 
            ]);

            // Perform the rotation, and move the polygon back to its original position. 
            this.matrix = math.multiply(p, rotM).map(function (value, index) {
                return value + origo[index[1]];
            });
            this.recalculate();
            return this;
        },
        // Flips this polygon around the X-axis. 
        flipX: function(degree) {
            var rad = degree * (Math.PI/180);
            var centroid = this.centroid();
            this.matrix = this.matrix.map(function (value, index) {
                if (index[1] === 0) {
                    if (value > centroid[0]) 
                        return value - (value-centroid[0])*Math.abs(Math.sin(rad))
                    else 
                        return value + (centroid[0]-value)*Math.abs(Math.sin(rad))
                } else 
                    return value
            });
            this.recalculate();
            return this;
        },
        // Flips this polygon around the Y-axis. 
        flipY: function(degree) {
            var rad = degree * (Math.PI/180);
            var centroid = this.centroid();
            console.log(centroid);
            this.matrix = this.matrix.map(function (value, index) {
                if (index[1] === 1) {
                    if (value > centroid[1]) 
                        return value - (value-centroid[1])*Math.abs(Math.sin(rad))
                    else 
                        return value + (centroid[1]-value)*Math.abs(Math.sin(rad))
                } else 
                    return value
            });
            this.recalculate();
            return this;
        },
        // Move the polygon 
        move: function(dX, dY) {
            dY=dY?dY:0;
            dX=dX?dX:0;
            this.matrix = this.matrix.map(function (value, index) {
                if (index[1] == 0) 
                    return value + dX;
                else 
                    return value + dY;
            })
            this.recalculate();
            return this;
        },
        // Scale/resize the polygon by a factor
        scale: function(factorX, factorY) {
            var centroid1 = this.centroid();
            this.matrix = this.matrix.map(function (value, index) {
                if (index[1] === 0) {
                    return value * factorX;
                } else {
                    return value * factorY;
                }
            });
            this.recalculate();
            var centroid2 = this.centroid(true);
            this.move(centroid1[0]-centroid2[0], centroid1[1]-centroid2[1]);
            return this;
        },
        // This is necessary when we have moved or changed the parameters of the polygon. Alot of caches must be purged etc. 
        recalculate: function() {
            this._bbox = false;
            this._area = false;
            this._centroid = false;
            this.points = this.matrix.valueOf();
        },
        clone: function() {
            return new Polygon(this.points);
        }
    }

    return Polygon;
});
