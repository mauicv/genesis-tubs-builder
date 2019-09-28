<template>
  <div style="margin-top: 5px;">
    <div v-if="focus != null">
      <div
          class="menu-option"
        >
        <span
            style="color: white;"
            v-on:click="deleteFocus"
          >
          DELETE
        </span>
      </div>
      <div
          :class="selection == 'Glue' ? 'menu-option-selected' : 'menu-option'"
          v-if="canGlue"
          v-on:click="setGlueMode"
        >
        <span style="color: white;">
          ADD GLUE
        </span>
      </div>
      <div
          class="menu-option"
          v-if="focus.glues.length>0"
          v-on:click="removeConvexSetGlues"
        >
        <span style="color: white;">
          REMOVE ALL GLUES
        </span>
      </div>
      <div
          :class="selection == 'Joint' ? 'menu-option-selected' : 'menu-option'"
          v-if="canJoin"
          v-on:click="setJointMode"
        >
        <span style="color: white;">
          ADD JOINT
        </span>
      </div>
      <div
          class="menu-option"
          v-if="focus.joints.length>0"
          v-on:click="removeConvexSetJoints"
        >
        <span style="color: white;">
          REMOVE ALL JOINTS
        </span>
      </div>
      <div
          :class="selection == 'Graphic' ? 'menu-option-selected' : 'menu-option'"
          v-on:click="setSelection('Graphic')"
        >
        <span style="color: white;">
          ADD GRAPHIC
        </span>
      </div>
      <div
          class="menu-option"
          v-if="focus.graphics.length > 0"
          v-on:click="removeLastGraphic"
        >
        <span style="color: white;">
          UNDO LAST GRAPHIC
        </span>
      </div>
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
