
var primatives = require('../../../primatives/primatives.js')

function draw(ctx){
  var drawCtx = ctx.canvas.getContext("2d");
  drawCtx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  ctx.convexSets.forEach(function(set){
    drawConvexSet(set, drawCtx, 'white')
  })

  drawCtx.strokeStyle="blue";
  if(ctx.selection == 'Convex Set') {
    ctx.memory.forEach(function(point, index){
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

  if(ctx.focus) {
    if (ctx.focus instanceof primatives.ConvexSet) {
      drawConvexSet(ctx.focus, drawCtx, 'red')
    }
  }
}

function drawConvexSet(set, drawCtx, color){
  set.lines.forEach(function(line){
    drawLine(line, drawCtx, color)
  })
}

function drawLine(line, drawCtx, color = 'white'){
  drawCtx.strokeStyle=color;
  drawCtx.beginPath();
  drawCtx.moveTo(line.from.x[0],line.from.x[1]);
  drawCtx.lineTo(line.to.x[0],line.to.x[1]);
  drawCtx.stroke();
}

export { draw }
