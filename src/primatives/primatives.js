
var engine = require('genesis-tubs-engine')
const gm = engine.GeneralMethods

class Point {
  constructor(x){
    this.x = x
  }

  copy(){
    return Point(this.x[0], this.x[1])
  }

  distanceFrom(point){
    return gm.size(point.x, this.x);
  }
}

class Line {
  constructor(from, to){
    this.from=from
    this.to=to
  }

  perpDistance(x){
    return gm.dot(gm.minus(x,this.from.x),gm.dev(gm.perp(gm.minus(this.to.x,this.from.x)),this.length));
  }

  horiDistance(x){
    return gm.dot(gm.minus(x,this.from.x),gm.dev(gm.minus(this.to.x,this.from.x),this.length));
  }

  distanceFrom(x){
    return gm.len(this.perpDistance(x),this.horiDistance(x));
  }
}

class ConvexSet {
  constructor(points){
    this.lines = []
    for(var i=0;i<points.length;i++){
      var newLine = new Line(points[i],points[(i+1)%points.length]);
      this.lines.push(newLine);
    }
  }

  distanceFrom(x){
    var d_max=-10000;
    var d=0;
    this.lines.forEach(function(line){
      d=line.perpDistance(x);
      if(d>d_max){
        d_max=d;
      }
    });

    return d_max;
  }
}

export { Point, Line, ConvexSet }
