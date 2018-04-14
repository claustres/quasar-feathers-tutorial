import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import auth from 'src/auth'

Vue.use(VueRouter)

const router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {

  if (!to.meta.requiresAuth || auth.authenticated()) {
    next()
  } else {
    console.log('Not authenticated')

    next({ path: '/home' })
  }
})

export default router
