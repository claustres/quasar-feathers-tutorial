<template>
  <q-layout ref="layout">
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()" v-show="authenticated">
        <q-icon name="menu" />
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Menu</q-tooltip>
      </q-btn>

      <q-toolbar-title>
        Quasar + Feathers boilerplate
      </q-toolbar-title>

      <q-btn flat @click="goTo('signin')" v-show="!authenticated">
        Sign In
      </q-btn>
      <q-btn flat @click="goTo('register')" v-show="!authenticated">
        Register
      </q-btn>
      <q-btn flat round @click="goTo('home')" v-show="authenticated">
        <q-icon name="home" />
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Home</q-tooltip>
      </q-btn>
      <q-btn flat round @click="goTo('chat')" v-show="authenticated">
        <q-icon name="chat" />
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Chat</q-tooltip>
      </q-btn>
      <q-btn flat round @click="signout" v-show="authenticated">
        <q-icon name="exit_to_app" />
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Signout</q-tooltip>
      </q-btn>

    </q-toolbar>

    <div slot="left" ref="menu" v-if="authenticated">
      <q-side-link item to="/home">
        <q-item-side icon="home" />
        <q-item-main label="Home"/>
      </q-side-link>
      <q-side-link item to="/chat">
        <q-item-side icon="chat" />
        <q-item-main label="Chat"/>
      </q-side-link>
      <q-collapsible icon="info" label="About">
        <p style="padding: 25px;" class="text-grey-7">
          This is a template project combining the power of Quasar and Feathers to create real-time web apps.
        </p>
      </q-collapsible>
    </div>

    <!-- sub-routes -->
    <router-view :user="user"></router-view>

  </q-layout>
</template>

<script>
  import {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QTooltip,
    QBtn,
    QIcon,
    QFab,
    QFabAction,
    QSideLink,
    QCollapsible,
    QItem,
    QItemSide,
    QItemMain,
    Toast
  } from 'quasar'
  import api from 'src/api'

  export default {
    name: 'index',
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QTooltip,
      QBtn,
      QIcon,
      QFab,
      QFabAction,
      QSideLink,
      QCollapsible,
      QItem,
      QItemSide,
      QItemMain,
      Toast
    },
    data () {
      return {
        user: null
      }
    },
    computed: {
      authenticated () {
        return this.$data.user !== null
      }
    },
    methods: {
      goTo (route) {
        this.$router.push({ name: route })
      },
      signout () {
        api.logout()
          .then(() => {
          Toast.create.positive('You are now logged out, sign in again to continue to work')
      })
      .catch(_ => {
          Toast.create.negative('Cannot logout, please check again in a few minutes')
      })
      },
      getUser (accessToken) {
        return api.passport.verifyJWT(accessToken)
            .then(payload => {
            return api.service('users').get(payload.userId)
          })
      .then(user => {
          this.$data.user = user
        return user
      })
      }
    },
    mounted () {
      // Check if there is already a session running
      api.authenticate()
        .then((response) => {
        return this.getUser(response.accessToken)
      })
    .then(user => {
        Toast.create.positive('Restoring previous session')
    })
    .catch(_ => {
        this.$router.push({ name: 'home' })
    })
      // On successfull login
      api.on('authenticated', response => {
        this.getUser(response.accessToken)
        .then(user => {
        this.$router.push({ name: 'home' })
    })
    })
      // On logout
      api.on('logout', () => {
        this.$data.user = null
      this.$router.push({ name: 'home' })
    })
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="styl">

</style>
