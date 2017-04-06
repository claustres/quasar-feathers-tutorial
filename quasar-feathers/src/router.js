import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    {
      path: '/',
      component: load('Index'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: load('Home')
        },
        {
          path: '/signin',
          name: 'signin',
          component: load('SignIn')
        },
        {
          path: '/register',
          name: 'register',
          component: load('SignIn')
        },
        {
          path: '/chat',
          name: 'chat',
          component: load('Chat')
        }
      ]
    },
    {
      path: '*',
      component: load('Error404')
    } // Not found
  ]
})
