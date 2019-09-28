<template>
  <div style="margin-top: 5px;">
    <div
      class="menu-desc"
    >
      <span
          style="color: white;"
        >
        {{ memory.length }} SETS SELECTED
      </span>
    </div>
    <div
        class="menu-option"
        v-on:click="createStructure"
      >
      <span style="color: white;">
        CREATE STRUCTURE
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
    props: ['memory'],
    data: function () {
      return {}
    },
    computed: {
      ...mapGetters([
        'points',
        'lines',
        'convexSets',
        'selection'
      ]),
    },
    methods: {
      ...mapActions([
        'setSelection',
        'deleteConvexSet',
        'removeGlues',
        'removeJoints',
        'addStructure',
        'setSelection'
      ]),
      createStructure(){
        this.addStructure(this.memory)
        this.setSelection('Select')
        this.$emit('remove-focus')
      }
    }
  }

</script>
