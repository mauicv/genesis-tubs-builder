
var primatives = require('../../../primatives/primatives.js')

function addStructure(x, ctx){
  var selectedConvexSet = null
  ctx.convexSets
    .filter((set)=>!ctx.memory.includes(set))
    .forEach(function(set){
      if(set.distanceFrom(x.x)<6){
        selectedConvexSet=set;
      }
    });
  if(selectedConvexSet) ctx.memory = [...ctx.memory, selectedConvexSet]
}

export { addStructure }
