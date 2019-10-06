<template>
  <div id="wrapper">
    <test-side-bar
      v-on:restart="restart"
      v-on:stop="stop"
      v-on:start="start"
      v-on:leave="destroy"
    />
    <canvas
      v-on:click="handleMouseClick"
      id="TestCanvas"/>
  </div>
</template>

<script>
  import engine from 'genesis-tubs-engine'
  import { mapGetters } from 'vuex'
  import TestSideBar from '../SideBars/TestSideBar.vue'
  const fs = require('fs');
  const Features = engine.featureInstances;
  const Laws = engine.lawInstances;
  const Beam = engine.Beam;
  const Line = engine.Line;
  const Particle = engine.Particle;

  export default {
    name: 'test-canvas',
    components: {
      'test-side-bar': TestSideBar
    },
    computed: {
      ...mapGetters([]),
    },
    data: function () {
      return {
        canvas: null,
        canvasTop: null,
        canvasLeft: null,
        drawCtx: null,
        controller: null,
        running: false
      }
    },
    mounted(){
      var canvas = document.getElementById("TestCanvas");
      var WIDTH = document.documentElement.clientWidth-160;
      var HEIGHT = document.documentElement.clientHeight-160;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      var drawCtx = canvas.getContext("2d");
      var rect = canvas.getBoundingClientRect();
      this.canvas = canvas
      this.drawCtx = drawCtx
      this.canvasTop = rect.top
      this.canvasLeft = rect.left
      var environment = this.loadEnviroment()
      this.createAndstart(environment)
    },
    methods: {
      handleMouseMove(event) {
        var x = this.getCanvasLoc(event)

      },
      handleMouseClick(event) {
        var x = this.getCanvasLoc(event)

      },
      getCanvasLoc(event){
        return {x: [
          event.clientX - this.canvasLeft,
          event.clientY - this.canvasTop
        ]}
      },
      createAndstart(enviro){
        this.controller = this.createRunner(enviro)
        this.controller.run()
        this.running=true
      },
      restart(){
        if(this.controller) this.controller.destroy()
        var enviro = this.loadEnviroment()
        this.controller = this.createRunner(enviro)
        this.controller.run()
        this.running=true
      },
      stop(){
        if(this.controller) this.controller.stop()
        this.running=false
      },
      start(){
        if(this.controller && !this.running) {
          this.running=true
          this.controller.run()
        }
      },
      destroy(){
        if(this.controller) {
          this.running=false
          this.controller.destroy()
        }
      },
      loadEnviroment(){
        const loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        if (dir != '') {dir=`${dir}/`}
        var Data_string = fs.readFileSync(`${dir}env.txt`,  'utf8');
        var enviro = engine.SL.parseGTBFormat(Data_string);

        //bounding boxes
        enviro.structures.forEach(function(structure){
          enviro.builder.addBoundingRect(structure);
          structure.features.push(Features["mass"])
          structure.randomNudges(1)
        })

        return enviro
      },
      createRunner(enviro){
        var draw = this.draw
        var animationRef;

        function run(){
          enviro.timeStep();
          draw(enviro);
          animationRef = window.requestAnimationFrame( run );
        }

        function stop(){
          window.cancelAnimationFrame(animationRef)
        }

        function destroy(){
          stop()
          enviro = null
          animationRef = null
        }

        return {
          'run': run,
          'stop': stop,
          'destroy': destroy,
        }
      },
      draw(enviro){
        this.drawCtx.fillStyle="black";
        this.drawCtx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.drawCtx.strokeStyle = "grey";
        //draw all links...
        enviro.constraints.forEach(function(constraint,i){
      		if(constraint.visable){
      			this.drawCtx.beginPath();
      	    this.drawCtx.moveTo(constraint.from.x[0],constraint.from.x[1]);
      	    this.drawCtx.lineTo(constraint.to.x[0],constraint.to.x[1]);
      	    this.drawCtx.stroke();
      		}
        }, this);

        this.drawCtx.strokeStyle = "white";
      	enviro.graphics.forEach(function(graphic){
          if(graphic instanceof Line){
            if(graphic.visable){
        			this.drawCtx.beginPath();
        	    this.drawCtx.moveTo(graphic.from.x[0],graphic.from.x[1]);
        	    this.drawCtx.lineTo(graphic.to.x[0],graphic.to.x[1]);
        	    this.drawCtx.stroke();
        		}
          }else if(graphic instanceof Particle){
            this.drawCtx.beginPath();
            this.drawCtx.arc(graphic.x[0],graphic.x[1],1,0,2*Math.PI);
            this.drawCtx.stroke();
          }
        }, this);
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background-color: black;
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  canvas {
    border-style: solid;
    border-color: grey;
    border-width: 1px;
    border-radius: 5px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  #draggableMenu {
    position: absolute;
    z-index: 9;
    background-color: #2A2A2E;
    border: 1px solid #4688F1;
    border-radius: 4px;
    /* text-align: center; */
    min-width: 150px;
  }

  #draggableMenuheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #4688F1;
    color: #fff;
  }

  .menu-option {
    background-color: #1E1E21;
    cursor: pointer;
    margin: 4px;
  }

  .menu-desc {
    background-color: #4688F1;
    margin: 4px;
  }

  .menu-option:hover {
    background-color: #2A2A2E;
    margin: 4px;
  }

  .menu-option-selected {
    background-color: #92b8f4;
    margin: 4px;
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
    float: right;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .btn-delete {
    padding: 0px 5px;
    border-radius: 50%;
    background: red;
    color: white;
    float: right;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
