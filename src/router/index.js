import Vue from 'vue'
import VueRouter from 'vue-router'
import Covid from '../views/Covid.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Covid',
    component: Covid
  }
]

const router = new VueRouter({
  routes
})

export default router
