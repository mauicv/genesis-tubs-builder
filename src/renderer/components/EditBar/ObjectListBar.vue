<template>
  <div>
    <div class="badge">
      <span
          style="color: white;"
        >
        {{this.links.length}} Links:
      </span>
    </div>
    <div
        v-for="link in this.links"
        @mouseover="$emit('hover-over-link', link)"
        @mouseleave="$emit('hover-away-link', link)"
        v-on:click="deleteLink(link)"
        class="badge"
      >
      <span style="color: white;">
        X
      </span>
    </div>
    <div class="badge">
      <span
          style="color: white;"
        >
        {{this.structures.length}} Stuctures:
      </span>
    </div>
    <div
        v-for="structure in this.structures"
        @mouseover="$emit('hover-over-structure', structure)"
        @mouseleave="$emit('hover-away-structure', structure)"
        v-on:click="deleteStructure(structure)"
        class="badge"
      >
      <span style="color: white;">
        X
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
    data: function () {
      return {
        focusedStructure: false
      }
    },
    computed: {
      ...mapGetters([
        'links',
        'structures'
      ]),
    },
    methods: {
      ...mapActions([
        'removeStructure',
        'removeLink',
      ]),
      deleteStructure(structure){
        this.removeStructure(structure)
      },
      deleteLink(link){
        this.removeLink(link)
      },
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
