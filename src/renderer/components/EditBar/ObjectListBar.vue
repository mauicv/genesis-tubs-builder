<template>
  <div style="margin-top: 5px;">
    <div v-if="this.links.length > 0">
      <div
        class="menu-desc"
      >
        <span
            style="color: white;"
          >
            LINKS:
        </span>
      </div>
      <div
          class="menu-option"
          v-for="link, index in this.links"
          @mouseover="$emit('hover-over-link', link)"
          @mouseleave="$emit('hover-away-link', link)"
        >
        <span style="color: white;">
          Link {{ index + 1 }}
        </span>
        <span
          class='btn-delete'
          v-on:click="deleteLink(link)"
        >
          &#10007;
        </span>
      </div>
    </div>
    <div v-if="this.structures.length > 0">
      <div
        class="menu-desc"
      >
        <span
            style="color: white;"
          >
          STRUCTURES:
        </span>
      </div>
      <div
          class="menu-option"
          v-for="structure, index in this.structures"
          @mouseover="$emit('hover-over-structure', structure)"
          @mouseleave="$emit('hover-away-structure', structure)"
        >
        <span style="color: white;">
          Structure {{ index + 1 }}
        </span>
        <span
            class='btn-delete'
            v-on:click="deleteStructure(structure)"
          >
          &#10007;
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
