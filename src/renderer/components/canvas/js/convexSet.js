
var primatives = require('../../../../primatives/primatives.js')

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

export { addPointToConvextSet }
