
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

  incident(line){
    var fromIncident =
      line.from.distanceFrom(this.from) == 0 ||
      line.to.distanceFrom(this.to) == 0;
    var toIncident =
      line.to.distanceFrom(this.from) == 0 ||
      line.from.distanceFrom(this.to) == 0;
    return fromIncident || toIncident
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

class Glue {
  constructor(sides){
    this.sides = sides
  }
}

class Joint {
  constructor(linePairs){
    var linePair1 = linePairs[0]
    var linePair2 = linePairs[1]
    this.line1 = linePair1[0]
    this.line2 = linePair2[0]
    var points1 = [linePair1[0].from, linePair1[0].to]
    var points2 = [linePair2[0].from, linePair2[0].to]
    points1.forEach(function(thisPoint){
      points2.forEach(function(thatPoint){
        if (thisPoint.distanceFrom(thatPoint) == 0) {
          this.point = thisPoint
        }
      }, this)
    }, this)
  }
}

class ConvexSet {
  constructor(points, lines){
    this.lines = []
    this.glues = []
    this.joints = []

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

  toAllPoints(){
    return this.lines
      .map((line)=>[line.from, line.to])
      .reduce((acc,cur)=>[...acc, ...cur], [])
  }

  sideAligned(convexSet){
    if(this == convexSet) return false
    return this.lines.some(function(thisLine){
      return convexSet.lines.some(function(otherLine){
        return thisLine.coAligned(otherLine)
      })
    })
  }

  getAlignedSides(convexSet){
    if(this == convexSet) return false
    var alignedLines = false
    this.lines.forEach(function(thisLine){
      return convexSet.lines.forEach(function(otherLine){
        if (thisLine.coAligned(otherLine)) {
          alignedLines = [thisLine, otherLine]
        }
      })
    })
    return alignedLines
  }

  isGluedTo(convexSet){
    return this.glues.some(function(thisGlue){
      return convexSet.glues.some(function(thatGlue){
        return thisGlue == thatGlue
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

  getIncidentSides(convexSet){
    if(this == convexSet) return false
    if(this.sideAligned(convexSet)) return false
    var thisIncidentLines = []
    var thoseIncidentLines = []
    this.lines.forEach(function(thisLine){
      convexSet.lines.forEach(function(thatLine){
        if(thisLine.incident(thatLine)){
          if (!thisIncidentLines.includes(thisLine))
            thisIncidentLines.push(thisLine)
          if (!thoseIncidentLines.includes(thatLine))
            thoseIncidentLines.push(thatLine)
        }
      })
    })
    return [thisIncidentLines, thoseIncidentLines]
  }

  isJointTo(convexSet){
    return this.joints.some(function(thisJoint){
      return convexSet.joints.some(function(thatJoint){
        return thisJoint == thatJoint 
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

export { Point, Line, Glue, Joint, ConvexSet }
