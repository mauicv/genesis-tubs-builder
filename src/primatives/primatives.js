
var engine = require('genesis-tubs-engine')
const gm = engine.GeneralMethods

class Point {
  constructor(x){
    this.x = x
  }

  copy(){
    return new Point(this.x)
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

  coAligned(line){
    var aligned =
      line.from.distanceFrom(this.from) == 0 &&
      line.to.distanceFrom(this.to) == 0;
    var reverseAligned =
      line.to.distanceFrom(this.from) == 0 &&
      line.from.distanceFrom(this.to) == 0;
    return aligned || reverseAligned
  }

  perpDistance(x){
    var v_from_x = gm.minus(x, this.from.x)
    var unit_normal = gm.dev(
      gm.perp(gm.minus(this.to.x, this.from.x)),
      gm.size(this.to.x, this.from.x))
    return gm.dot(v_from_x, unit_normal);
  }

  horiDistance(x){
    var v_from_x = gm.minus(x, this.from.x)
    var tangent_normal = gm.dev(
      gm.minus(this.to.x,this.from.x),
      gm.size(this.to.x, this.from.x))
    return gm.dot(v_from_x, tangent_normal);
  }

  distanceFrom(x){
    return gm.len(this.perpDistance(x),this.horiDistance(x));
  }
}

class ConvexSet {
  constructor(points, lines){
    this.lines = []
    if (lines == null) {
      for(var i=0;i<points.length;i++){
        var newLine = new Line(points[i],points[(i+1)%points.length]);
        this.lines.push(newLine);
      }
    } else {
      this.lines = lines
    }

    this.fixAntiClockwiseOrientaion()
  }

  toPoints(){
    return this.lines.map((line)=>line.from)
  }

  sideAligned(convexSet){
    if(this == convexSet) return false
    return this.lines.some(function(thisLine){
      return convexSet.lines.some(function(otherLine){
        return thisLine.coAligned(otherLine)
      })
    })
  }

  pointInCommon(convexSet){
    if(this == convexSet) return false
    if(this.sideAligned(convexSet)) return false
    return this.toPoints().some(function(thisPoint){
      return convexSet.toPoints().some(function(otherPoint){
        return thisPoint.distanceFrom(otherPoint) == 0
      })
    })
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

  fixAntiClockwiseOrientaion(){
		if(this.lines[0].perpDistance(this.lines[1].to.x)>0){
			this.reverseOrient();
		}
	}

  reverseOrient(){
		var temp=0;
		this.lines.forEach(function(link){
			temp=link.from;
			link.from=link.to;
			link.to=temp;
		});

		var numLines=this.lines.length;
		var tempLines=this.lines.slice();

		tempLines.forEach(function(link,index){
			this.lines[numLines-index-1]=link;
		},this);
	}
}

export { Point, Line, ConvexSet }
