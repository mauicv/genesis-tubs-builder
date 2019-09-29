<template>
  <sidebar-menu :menu="menu" @item-click="onItemClick" :collapsed="true"/>
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
                        href: '/test',
                        title: 'Run',
                        icon: 'glyphicon glyphicon-play',
                    }
                ]
            }
        },
        methods: {
          ...mapActions([
            'save',
            'load',
            'setSelection',
            'setFocus'
          ]),
          onItemClick(event, item) {
            if (item.title == 'Save') {
              this.save()
              this.setSelection('Select')
            } else if (item.title == 'Load') {
              this.load();
              this.setSelection('Select')
            } else if (item.title == 'Link') {
              this.setSelection(item.title)
              this.setFocus(null)
            } else if (item.title == 'Structure') {
              this.setSelection(item.title)
              this.setFocus(null)
            } else if (item.title == 'Run') {
              console.log('run')
            } else {
              this.setSelection(item.title)
            }
          }
        },
      }

</script>
