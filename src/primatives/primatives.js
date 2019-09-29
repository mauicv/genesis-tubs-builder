
var engine = require('genesis-tubs-engine')
const gm = engine.GeneralMethods
const uuidv1 = require('uuid/v1');

class BaseId {
  constructor(){
    this.uuid = uuidv1();
  }

  equals(other){
    return this.uuid == other.uuid
  }

  notEquals(other){
    return this.uuid != other.uuid
  }
}

class Point extends BaseId {
  constructor(x){
    super()
    this.x = x
  }

  toJSON(){
    var data={
        "type": "Point",
        "uuid": this.uuid,
        "cArgs": [this.x],
        "eArgs": {},
        "x": this.x
      };
      return data;
  }

  copy(){
    return new Point(this.x)
  }

  distanceFrom(point){
    return gm.size(point.x, this.x);
  }
}

class RelPoint extends Point {
  constructor(x, line){
    x instanceof Point ? super(x.x) : super(x)
    this.anchor=line;
  }

  toJSON(){
		var data={
				"type": "RelPoint",
				"uuid": this.uuid,
        "cArgs": [this.x, this.anchor.uuid],
        "eArgs": {
          'anchor': this.anchor.uuid
        },
				"x": this.x,
        "anchor": this.anchor.uuid
			};
			return data;
	}
}

class Line extends BaseId{
  constructor(from, to){
    super()
    this.from=from
    this.to=to
  }

  toJSON(){
		var data={
				"type": "Line",
				"uuid": this.uuid,
        "cArgs": [this.to.uuid, this.from.uuid],
        "eArgs": {
          "from": this.from.uuid,
          "to": this.to.uuid
        },
				"to": this.to.uuid,
        "from": this.from.uuid,
			};
			return data;
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

class Beam extends Line {
  constructor(from, to){
    super(from, to)
  }

  toJSON(){
    var data={
        "type": "Beam",
        "uuid": this.uuid,
        "cArgs": [this.to.uuid, this.from.uuid],
        "eArgs": {
          "from": this.from.uuid,
          "to": this.to.uuid
        },
        "to": this.to.uuid,
        "from": this.from.uuid,
      };
      return data;
  }
}

class Glue extends BaseId{
  constructor(sides){
    super()
    this.sides = sides
  }

  toJSON(){
		var data={
				"type": "Glue",
				"uuid": this.uuid,
        "cArgs": this.sides.map(side=>side.uuid),
        "eArgs": {'sides': this.sides.map(side=>side.uuid)},
				"sides": this.sides.map(side=>side.uuid),
			};
			return data;
	}
}

class Joint extends BaseId{
  constructor(linePairs, point){
    super()
    var linePair1 = linePairs[0]
    var linePair2 = linePairs[1]
    this.line1 = linePair1[0]
    this.line2 = linePair2[0]
    var points1 = [linePair1[0].from, linePair1[0].to]
    var points2 = [linePair2[0].from, linePair2[0].to]
    if (point == null) {
      points1.forEach(function(thisPoint){
        points2.forEach(function(thatPoint){
          if (thisPoint.distanceFrom(thatPoint) == 0) {
            this.point = thisPoint
          }
        }, this)
      }, this)
    } else {
      this.point = point
    }
  }

  toJSON(){
		var data={
				"type": "Joint",
				"uuid": this.uuid,
        "cArgs": [this.line1.uuid, this.line2.uuid, this.point.uuid],
        "eArgs": {
          "line1": this.line1.uuid,
          "line2": this.line2.uuid,
          "point": this.point.uuid,
        },
				"line1": this.line1.uuid,
        "line2": this.line2.uuid,
        "point": this.point.uuid,
			};
			return data;
	}
}

class Graphic extends BaseId{
  constructor(points, lines){
    super()
    this.lines = []

    if (lines == null) {
      for(var i=0;i<points.length-1;i++){
        var newLine = new Line(points[i],points[(i+1)]);
        this.lines.push(newLine);
      }
    } else {
      this.lines = lines
    }
  }

  toJSON(){
		var data={
				"type": "Graphic",
				"uuid": this.uuid,
        "cArgs": [null, this.lines.map(line=>line.uuid)],
        "eArgs": {
          "lines": this.lines.map(line=>line.uuid)
        },
				"lines": this.lines.map(line=>line.uuid)
			};
			return data;
	}
}

class ConvexSet extends BaseId{
  constructor(points, lines){
    super()
    this.lines = []
    this.glues = []
    this.joints = []
    this.graphics = []

    if (lines == null) {
      for(var i=0;i<points.length;i++){
        var newLine = new Line(points[i],points[(i+1)%points.length]);
        this.lines.push(newLine);
      }
      this.fixAntiClockwiseOrientaion()
    } else {
      this.lines = lines
    }
  }

  toJSON(){
		var data={
				"type": "ConvexSet",
				"uuid": this.uuid,
        "cArgs": [null, this.lines.map(line=>line.uuid)],
        "eArgs": {
          "lines": this.lines.map(line=>line.uuid),
          "glues": this.glues.map(glue=>glue.uuid),
          "joints": this.joints.map(joint=>joint.uuid),
          "graphics": this.graphics.map(graphic=>graphic.uuid)
        },
				"lines": this.lines.map(line=>line.uuid),
        "glues": this.glues.map(glue=>glue.uuid),
        "joints": this.joints.map(joint=>joint.uuid),
        "graphics": this.graphics.map(graphic=>graphic.uuid)
			};
			return data;
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

class Structure extends BaseId {
  constructor(sets){
    super()
    this.sets = sets
  }

  toJSON(){
		var data={
				"type": "Structure",
				"uuid": this.uuid,
        "cArgs": [this.sets.map(set=>set.uuid)],
        "eArgs": {
          "sets": this.sets.map(set=>set.uuid)
        },
				"sets": this.sets.map(set=>set.uuid)
			};
			return data;
	}
}

export { Point, Line, Glue, Joint, ConvexSet, Structure, RelPoint, Graphic, Beam }
