<template>
  <div id="app">
    <sidebar-menu :menu="menu" @item-click="onItemClick" :collapsed="true"/>
    <router-view></router-view>
  </div>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'genesis-tubs-builder',
    data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Options',
                        hiddenOnCollapse: true
                    },
                    {
                        href: '/',
                        title: 'Save',
                        icon: {
                            element: 'i',
                            class: 'glyphicon glyphicon-floppy-disk',
                        },
                    },
                    {
                        href: '/',
                        title: 'Load',
                        icon: {
                            element: 'i',
                            class: 'glyphicon glyphicon-open',
                        },
                    },
                    {
                        href: '/',
                        title: 'Add',
                        icon: 'glyphicon glyphicon-plus-sign',
                        child: [
                            {
                                href: '/',
                                title: 'Convex Set'
                            },
                            {
                                href: '/',
                                title: 'Link'
                            },
                            {
                                href: '/',
                                title: 'Structure'
                            },
                        ]
                    },
                    {
                        href: '/',
                        title: 'Remove',
                        icon: 'glyphicon glyphicon-minus-sign',
                        child: [
                            {
                                href: '/',
                                title: 'Delete Structure'
                            },
                        ]
                    },
                    {
                        href: '/',
                        title: 'Selection',
                        icon: 'glyphicon glyphicon-record',
                        child: [
                            {
                                href: '/',
                                title: 'Zoom on Selection'
                            },
                            {
                                href: '/',
                                title: 'Zoom'
                            },
                            {
                                href: '/',
                                title: 'Reset'
                            }
                        ]
                    },
                    {
                        href: '/',
                        title: 'Run',
                        icon: 'glyphicon glyphicon-play',
                    }
                ]
            }
        },
        methods: {
          ...mapActions(['save', 'load', 'setSelection']),
          onItemClick(event, item) {
            if (item.title == 'Save') { this.save() }
            if (item.title == 'Load') { this.load() }
            else {
              this.setSelection(item.title)
            }
          }
        },
      }

</script>
<style>
  /* CSS */
</style>
