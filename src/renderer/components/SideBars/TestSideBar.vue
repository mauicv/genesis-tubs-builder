<template>
  <sidebar-menu :menu="menu" @item-click="onItemClick" :collapsed="true"/>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'test-sidebar',
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
                        title: 'Back',
                        icon: 'glyphicon glyphicon-arrow-left',
                    },
                    {
                        href: '/test',
                        title: 'Restart',
                        icon: 'glyphicon glyphicon-refresh',
                    },
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
            if(item.title == 'Restart') {
              this.$emit('restart')
            }
          }
        },
      }

</script>
