
var primatives = require('../../../primatives/primatives.js')

function detectNear(x, ctx){
  var focus = null;
  ctx.convexSets.forEach(function(item){
    if (!(item instanceof primatives.ConvexSet)) return
    if(item.distanceFrom(x.x)<6){
      if(ctx.focus!==item){
        focus=item;
      }
    }
  });

  ctx.focus = focus
}

export { detectNear }
