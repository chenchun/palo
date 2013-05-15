/**
 * A 3-dimensional vector representation with common vector operations
 */
function Vector() {
    var argc = arguments.length;
    if (argc === 3) {
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
    }
    else if (argc === 1) {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
        this.z = arguments[0].z;
    }
    else {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
Vector.prototype.set = function() {
    var argc = arguments.length;
    if (argc === 3) {
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
    }
    else if (argc === 1) {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
        this.z = arguments[0].z;
    }
};
Vector.prototype.add = function(v) {
    var argc = arguments.length;
    if (argc === 3) {
        this.x += arguments[0];
        this.y += arguments[1];
        this.z += arguments[2];
    }
    else if (argc === 1) {
        this.x += arguments[0].x;
        this.y += arguments[0].y;
        this.z += arguments[0].z;
    }
};
Vector.prototype.substract = function(v) {
    var argc = arguments.length;
    if (argc === 3) {
        this.x -= arguments[0];
        this.y -= arguments[1];
        this.z -= arguments[2];
    }
    else if (argc === 1) {
        this.x -= arguments[0].x;
        this.y -= arguments[0].y;
        this.z -= arguments[0].z;
    }
};
Vector.prototype.scale = function(f) { this.x *= f; this.y *= f; this.z *= f; };
Vector.prototype.distanceTo = function() {
    var argc = arguments.length;
    if (argc === 3) {
        var dx = this.x - arguments[0];
        var dy = this.y - arguments[1];
        var dz = this.z - arguments[2];
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    else if (argc === 1) {
        return Math.sqrt(this.distanceSquaredTo(arguments[0]));
    }
};
Vector.prototype.distanceSquaredTo = function(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var dz = this.z - v.z;
    return dx*dx + dy*dy + dz*dz;
};
Vector.prototype.dot = function(v) { return this.x*v.x + this.y*v.y + this.z*v.z; };
Vector.prototype.length = function() { return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z); };
Vector.prototype.lengthSquared = function() { return this.x*this.x + this.y*this.y + this.z*this.z; };
Vector.prototype.clear = function() { this.x = 0; this.y = 0; this.z = 0; };
Vector.prototype.toString = function() { return '('+this.x+','+this.y+','+this.z+')'; };
Vector.prototype.cross = function(v) {
    return new Vector(
        this.y*v.z - this.z*v.y,
        this.x*v.z - this.z*v.x,
        this.x*v.y - this.y*v.x
    );
};
Vector.prototype.isZero = function() {
    return this.x === 0 && this.y === 0 && this.z === 0;
};

/**
 * 圆
 * @constructor
 */
function Circle() {
    var argc = arguments.length;
    if (argc === 3) {
        this.v = new Vector(arguments[0], arguments[1], arguments[2]);
        this.r = arguments[2];
    }
    else if (argc === 2) {
        this.v = arguments[0];
        this.r = arguments[1];
    }
    else {
        this.v = new Vector();
        this.r = 0;
    }
}
Circle.prototype.center = function() {
    return this.v;
};
Circle.prototype.add = function() {
    var argc = arguments.length;
    if (argc === 2) {
        this.v.add(arguments[0]);
        this.r += arguments[1];
    }
    else if (argc === 1) {
        this.v.add(arguments[0].p);
        this.r += arguments[0].r;
    }
}
/**
 * 画圆
 *
 * @return {*|jQuery}
 */
Circle.prototype.draw = function() {
    return $('<div>')
        .css({
            'position': 'absolute',
            'border-radius': this.r,
            'width': 2*this.r,
            'height': 2*this.r
        })
        .offset({'left': this.v[0] - this.r, 'top': this.v[1] - this.r});
}

/**
 * A line
 * @constructor
 */
function Line() {
    var argc = arguments.length;
    if (argc === 6) {
        this.s = new Vector(arguments[0], arguments[1], arguments[2]);
        this.e = new Vector(arguments[3], arguments[4], arguments[5]);
    }
    else if (argc === 2) {
        this.s = arguments[0];
        this.e = arguments[1];
    }
    else {
        this.s = new Vector();
        this.e = new Vector();
    }
}
/**
 * 画一条线
 *
 * @return {Function|line}
 */
Line.prototype.draw = function() {
    var length = this.s.distanceTo(this.e);
    var angle  = Math.atan2(this.e.y - this.s.y, this.e.x - this.s.x) * 180 / Math.PI;
    var transform = 'rotate('+angle+'deg)';

    this.line = $('<div>')
        .addClass('line')
        .css({
            'position': 'absolute',
            'transform': transform,
            'transform-origin': '0% 50%'
        })
        .width(length)
        .height('2px')
        .offset({'left': this.s.x, 'top': this.s.y});
    return this.line;
}
/**
 * 移动到另外的两个点
 * @param p1
 * @param p2
 * @return {Function|line}
 */
Line.prototype.moveTo = function(p1, p2) {
    var length = p1.distanceTo(p2);
    var angle  = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    var transform = 'rotate('+angle+'deg)';
    this.line.css({
        'transform': transform
    }).width(length).css({
            'left' : p1[0] + "px",
            'top' : p1[1] + "px"
        })
    //.offset({'left': p1[0], 'top': p1[1]});
    return this.line;
}
Line.prototype.getStartPoint = function() {
    return this.s;
}
Line.prototype.getEndPoint = function() {
    return this.e;
}