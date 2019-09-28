
var primatives = require('../../../primatives/primatives.js')

function addPointToGraphic(x, ctx){
  var newPoint = new primatives.Point(x.x);
  if (ctx.memory.length == 0) ctx.firstPoint = newPoint;
  ctx.memory.push(newPoint)
}

function completeGraphic(x, ctx){
  ctx.addGraphic(ctx.memory)
  ctx.clearToSelect()
}

export { addPointToGraphic, completeGraphic }
