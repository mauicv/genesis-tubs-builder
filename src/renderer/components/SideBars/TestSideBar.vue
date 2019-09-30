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
                        href: '/test',
                        title: 'Back',
                        icon: 'glyphicon glyphicon-arrow-left',
                    },
                    {
                        href: '/test',
                        title: 'Start',
                        icon: 'glyphicon glyphicon-play',
                    },
                    {
                      href: '/test',
                      title: 'Stop',
                      icon: 'glyphicon glyphicon-stop',
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
            } else if(item.title == 'Stop') {
              this.$emit('stop')
            } else if(item.title == 'Start') {
              this.$emit('start')
            } else if(item.title == 'Back') {
              this.$emit('leave')
              this.$router.push({ path: '/' })
            }
          }
        },
      }

</script>
