<template>
  <div id="wrapper">
    <span class="title">
      Genesis Tubs Environment builder
    </span>
    <canvas
      v-on:mousemove="handleMouseMove"
      v-on:click="handleMouseClick"
      v-on:dblclick="handleMouseDoubleClick"
      id="DrawingBoard"/>
    <edit-bar
      :focus="focus"
    />
    <zoom-bar style="float: right;"/>
  </div>
</template>

<script>
  var primatives = require('../../../primatives/primatives.js')
  import { addPointToConvextSet } from '../js/convexSet'
  import { detectNear } from '../js/select'
  import { draw } from '../js/draw'
  import { mapGetters, mapActions } from 'vuex'
  import EditBar from '../EditBar/EditBar.vue'
  import ZoomBar from '../ZoomBar/ZoomBar.vue'

  export default {
    name: 'drawing-canvas',
    components: {
      'edit-bar': EditBar,
      'zoom-bar': ZoomBar
    },
    data: function () {
      return {
        memory: [],
        firstPoint: null,
        focus: null,
        x: null
      }
    },
    computed: {
      ...mapGetters([
        'points',
        'lines',
        'convexSets',
        'selection',
        'canvas',
        'canvasLeft',
        'canvasTop'
      ])
    },
    watch: {
      points(newValue, oldValue) { draw(this) },
      lines(newValue, oldValue) { draw(this) },
      memory(memories){ draw(this) },
      convexSets(newValue, oldValue) { draw(this) },
      x(x){ draw(this) }
    },
    mounted(){
      var canvas = document.getElementById("DrawingBoard");
      this.setCanvas(canvas)
      this.clearToSelect()
    },
    methods: {
      ...mapActions(['setSelection', 'addConvexSet', 'setCanvas']),
      handleMouseMove(event) {
        var x = this.getCanvasLoc(event)
        if(this.memory.length > 0) this.x = x
      },
      handleMouseClick(event) {
        var x = this.getCanvasLoc(event)
        var options = {
          'Convex Set': addPointToConvextSet,
          'Select': detectNear,
        }[this.selection](x, this)
        draw(this)
      },
      handleMouseDoubleClick(event) {
        var x = this.getCanvasLoc(event)
        this.clearToSelect()
        draw(this)
      },
      getCanvasLoc(event){
        return {x: [
          event.clientX - this.canvasLeft,
          event.clientY - this.canvasTop
        ]}
      },
      clearToSelect(){
        this.setSelection('Select')
        this.memory = []
        this.x = null
        this.focus = null
      }
    }
  }

</script>

<style scoped>
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

  .badge {
    font-size: .8em;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: white;
    /* background-color: #4fc08d; */
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid white;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
