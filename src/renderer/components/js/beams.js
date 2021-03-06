
var primatives = require('../../../primatives/primatives.js')

function addLink(x, ctx){
  if(ctx.focus == null)
  var closePoint = null;

  ctx.points
    .forEach(function(point){
      if(point.distanceFrom(x)<6){
        closePoint=point;
      }
    });

  if(closePoint == null) return
  if(ctx.focus == null) {
    ctx.setFocus(closePoint);
    return
  }
  ctx.addLink([ctx.focus, closePoint])
  ctx.clearToSelect()
}

export { addLink }
