<template>
  <div>
    <div v-if="focus != null">
      <div class="badge">
        <span
            style="color: white;"
            v-on:click="deleteFocus"
          >
          DELETE
        </span>
      </div>
      <div
          v-if="canGlue"
          v-on:click="setGlueMode"
          class="badge"
          :style="`background-color: ${
            selection == 'Glue' ? 'lightblue' : 'grey'
          }`">
        <span style="color: white;">
          ADD GLUE
        </span>
      </div>
      <div
          v-if="focus.glues.length>0"
          v-on:click="removeConvexSetGlues"
          class="badge"
          >
        <span style="color: white;">
          REMOVE ALL GLUES
        </span>
      </div>
      <div
          v-if="canJoin"
          class="badge"
          v-on:click="setJointMode"
          :style="`background-color: ${
            selection == 'Joint' ? 'lightblue' : 'grey'
          }`"
        >
        <span style="color: white;">
          ADD JOINT
        </span>
      </div>
      <div
          v-if="focus.joints.length>0"
          v-on:click="removeConvexSetJoints"
          class="badge"
        >
        <span style="color: white;">
          REMOVE ALL JOINTS
        </span>
      </div>


      <div
          class="badge"
          v-on:click="setSelection('Graphic')"
          :style="`background-color: ${
            selection == 'Graphic' ? 'lightblue' : 'grey'
          }`"
        >
        <span style="color: white;">
          ADD GRAPHIC
        </span>
      </div>
      <div
          v-if="focus.graphics.length > 0"
          v-on:click="removeLastGraphic"
          class="badge"
        >
        <span style="color: white;">
          UNDO LAST GRAPHIC
        </span>
      </div>

      <!-- <div
          v-if="focus.joints.length>0"
          v-on:click="removeConvexSetJoints"
          class="badge"
        >
        <span style="color: white;">
          REMOVE ALL JOINTS
        </span>
      </div> -->


    </div>
    <div v-else class="badge">
      <span style="color: white;">
        ACTION: {{selection}}
      </span>
    </div>
  </div>
</template>

<script>
  var primatives = require('../../../primatives/primatives.js')
  import { addPointToConvextSet } from '../js/convexSet'
  import { detectNear } from '../js/select'
  import { draw } from '../js/draw'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'edit-bar',
    props: ['focus', 'memory'],
    data: function () {
      return {}
    },
    computed: {
      ...mapGetters([
        'points',
        'lines',
        'convexSets',
        'selection',
        'graphics'
      ]),
      canGlue: function(){
        if(!this.focus) return
        return this.convexSets.some((set)=>this.focus.sideAligned(set))
      },
      canJoin: function(){
        if(!this.focus) return
        return this.convexSets.some((set)=>this.focus.pointInCommon(set))
      },
    },
    methods: {
      ...mapActions([
        'setSelection',
        'deleteConvexSet',
        'removeGlues',
        'removeJoints',
        'removeLastGraphicOnConvexSet'
      ]),
      setGlueMode: function(){this.setSelection('Glue')},
      setJointMode: function(){this.setSelection('Joint')},
      deleteFocus: function(){
        this.deleteConvexSet(this.focus)
        this.setSelection('Select')
        this.$emit('remove-focus')
      },
      removeConvexSetGlues: function(){
        this.removeGlues(this.focus)
      },
      removeConvexSetJoints: function(){
        this.removeJoints(this.focus)
      },
      removeLastGraphic: function(){
        this.removeLastGraphicOnConvexSet(this.focus)
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
