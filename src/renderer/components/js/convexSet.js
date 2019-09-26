
var primatives = require('../../../primatives/primatives.js')

function addPointToConvextSet(x, ctx){
  var newPoint;

  if (ctx.firstPoint && ctx.firstPoint.distanceFrom(x) < 6) {
    var newConvexSet = new primatives.ConvexSet(ctx.memory)
    ctx.addConvexSet(newConvexSet)
    ctx.clearToSelect()
    return
  }

  ctx.points.forEach(function(point){
    if (point.distanceFrom(x) < 6) newPoint = point.copy();
  })

  if (!newPoint) newPoint = new primatives.Point(x.x);
  if (ctx.memory.length == 0) ctx.firstPoint = newPoint;
  ctx.memory.push(newPoint)
}

function addGlue(x, ctx){
  var secondConvexSet = null;
  ctx.convexSets
    .filter((set)=>set.sideAligned(ctx.focus))
    .forEach(function(set){
      if(set.distanceFrom(x.x)<6){
        secondConvexSet=set;
      }
    });
  if(secondConvexSet) {
    ctx.addGlue([ctx.focus, secondConvexSet])
    ctx.clearToSelect()
  }
}

function addJoint(x, ctx){
  var secondConvexSet = null;
  ctx.convexSets
    .filter((set)=>set.pointInCommon(ctx.focus))
    .forEach(function(set){
      if(set.distanceFrom(x.x)<6){
        secondConvexSet=set;
      }
    });

  if(secondConvexSet) {
    ctx.addJoint([ctx.focus, secondConvexSet])
    ctx.clearToSelect()
  }
}

export { addPointToConvextSet, addGlue, addJoint }
