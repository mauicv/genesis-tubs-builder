<template>
  <div id="wrapper">
    <span class="title">
      Genesis Tubs Environment builder
    </span>
    <div id="draggableMenu">
      <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
      <div id="draggableMenuheader">
        {{ selection }}
      </div>
      <edit-convex-set-bar
        v-if="convexSetSelected"
        :focus="focus"
        @remove-focus="clearToSelect"
      />
      <edit-structure-bar
        v-if="structureModeSelected"
        :memory="memory"
        @remove-focus="clearToSelect"
      />
      <object-list-bar
        v-if="this.structures.length > 0 || this.links.length > 0"
        @hover-over-structure="hoverOverStructure"
        @hover-away-structure="hoverAwayStructure"
        @hover-over-link="hoverOverLink"
        @hover-away-link="hoverAwayLink"
      />
    </div>
    <canvas
      v-on:mousemove="handleMouseMove"
      v-on:click="handleMouseClick"
      v-on:dblclick="handleMouseDoubleClick"
      v-on:keydown.native="keymonitor"
      id="DrawingBoard"/>
  </div>
</template>

<script>
  var primatives = require('../../../primatives/primatives.js')
  import { addPointToConvextSet, addGlue, addJoint } from '../js/convexSet'
  import { addPointToGraphic, completeGraphic } from '../js/graphics'
  import { addLink } from '../js/links'
  import { addStructure } from '../js/structures'
  import { detectNear } from '../js/select'
  import { draw, drawConvexSet, drawLine, drawStructure } from '../js/draw'
  import { mapGetters, mapActions } from 'vuex'
  import EditConvexSetBar from '../EditBar/EditConvexSetBar.vue'
  import EditStructureBar from '../EditBar/EditStructureBar.vue'
  import ObjectListBar from '../EditBar/ObjectListBar.vue'

  export default {
    name: 'drawing-canvas',
    components: {
      'edit-convex-set-bar': EditConvexSetBar,
      'edit-structure-bar': EditStructureBar,
      'object-list-bar': ObjectListBar,
    },
    data: function () {
      return {
        memory: [],
        firstPoint: null,
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
        'canvasTop',
        'glues',
        'joints',
        'links',
        'focus',
        'structures',
        'graphics',
        'relPoints',
      ]),
      convexSetSelected(){
        return this.focus instanceof primatives.ConvexSet
      },
      structureModeSelected(){
        return this.selection == 'Structure'
      }
    },
    watch: {
      points(newValue, oldValue) { draw(this) },
      lines(newValue, oldValue) { draw(this) },
      memory(memories){ draw(this) },
      convexSets(newValue, oldValue) { draw(this) },
      glues(newValue, oldValue) { draw(this) },
      joints(newValue, oldValue) { draw(this) },
      focus(newValue, oldValue){ draw(this) },
      links(newValue, oldValue){ draw(this) },
      structures(newValue, oldValue){ draw(this) },
      graphics(newValue, oldValue){ draw(this) },
      selection(newValue, oldValue){ draw(this) },
      x(x){ draw(this) },
    },
    mounted(){
      var canvas = document.getElementById("DrawingBoard");
      this.setCanvas(canvas)
      this.clearToSelect()
      window.addEventListener('keypress', this.handleKeyPress)
      dragElement(document.getElementById("draggableMenu"));
    },
    methods: {
      ...mapActions([
        'setSelection',
        'addConvexSet',
        'setCanvas',
        'move',
        'zoom',
        'addGlue',
        'addJoint',
        'addLink',
        'setFocus',
        'addGraphic'
      ]),
      handleMouseMove(event) {
        var x = this.getCanvasLoc(event)
        if((this.selection == 'Convex Set' || this.selection == 'Graphic')
            && this.memory.length > 0) this.x = x
      },
      handleMouseClick(event) {
        var x = this.getCanvasLoc(event)
        var options = {
          'Convex Set': addPointToConvextSet,
          'Select': detectNear,
          'Glue': addGlue,
          'Joint': addJoint,
          'Link': addLink,
          'Structure': addStructure,
          'Graphic': addPointToGraphic
        }[this.selection](x, this)
        draw(this)
      },
      handleMouseDoubleClick(event) {
        var x = this.getCanvasLoc(event)
        var options = {
          'Convex Set': this.clearToSelect,
          'Select': this.clearToSelect,
          'Glue': this.clearToSelect,
          'Joint': this.clearToSelect,
          'Link': this.clearToSelect,
          'Structure': this.clearToSelect,
          'Graphic': completeGraphic
        }[this.selection](x, this)
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
      },
      handleKeyPress(event){
        if(event.key == 'w') {
          this.move([0,-3])
        } else if (event.key == 's') {
          this.move([0,3])
        } else if (event.key == 'a') {
          this.move([-3,0])
        } else if (event.key == 'd') {
          this.move([3,0])
        } else if (event.key == 'x') {
          this.zoom(0.1)
        } else if (event.key == 'z') {
          this.zoom(-0.1)
        } else if (event.key == 'q') {
          this.setSelection('Select')
        } else if (event.key == 'c') {
          this.setSelection('Convex Set')
        } else if (event.key == 'l') {
          this.setSelection('Link')
        } else if (event.key == 'k') {
          this.setSelection('Structure')
        } else if (event.key == 'g') {
          if (this.focus instanceof primatives.ConvexSet){
            this.setSelection('Graphic')
          }
        }
      },
      hoverOverStructure(structure){
        var drawCtx = this.canvas.getContext("2d");
        drawStructure(structure, drawCtx, 'red')
      },
      hoverAwayStructure(structure){
        draw(this)
      },
      hoverOverLink(link){
        var drawCtx = this.canvas.getContext("2d");
        drawLine(link, drawCtx, 'red')
      },
      hoverAwayLink(link){
        draw(this)
      }
    }
  }

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
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
