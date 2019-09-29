import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'drawing-canvas',
      component: require('@/components/canvas/DrawingCanvas.vue').default
    },
    {
      path: '/test',
      name: 'test-canvas',
      component: require('@/components/canvas/TestCanvas.vue').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
