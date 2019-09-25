
var primatives = require('../../../../primatives/primatives.js')

function draw(ctx){
  var drawCtx = ctx.canvas.getContext("2d");
  drawCtx.fillStyle="white";
  ctx.convexSets.forEach(function(set){
    set.lines.forEach(function(line){
      drawLine(line, drawCtx)
    })
  })

  drawCtx.strokeStyle="blue";
  if(ctx.selection == 'Convex Set') {
    ctx.memory.forEach(function(point, index){
      console.log(ctx)
      if(index < ctx.memory.length - 1) {
        drawCtx.beginPath();
        drawCtx.moveTo(...point.x);
        drawCtx.lineTo(
          ...ctx.memory[index+1].x
        );
        drawCtx.stroke();
      }
    }, ctx)
  }

  if (ctx.x != null){
    drawCtx.strokeStyle="blue";
    drawCtx.beginPath();
    drawCtx.moveTo(...ctx.memory[ctx.memory.length - 1].x);
    drawCtx.lineTo(...ctx.x.x);
    drawCtx.stroke();
  }
}

function drawLine(line, drawCtx){
  drawCtx.beginPath();
  drawCtx.moveTo(line.from.x[0],line.from.x[1]);
  drawCtx.lineTo(line.to.x[0],line.to.x[1]);
  drawCtx.stroke();
}

export { draw }
