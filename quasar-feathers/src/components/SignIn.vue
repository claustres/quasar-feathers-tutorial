<template>
</template>

<script>
import { Toast, Dialog } from 'quasar'
import api from 'src/api'

// import { API } from 'src/api'

export default {
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    isRegistration () {
      return this.$route.name === 'register'
    },
    register (email, password) {
      return api.service('users').create({
        email: email,
        password: password
      })
    },
    login (email, password) {
      return api.authenticate({
        strategy: 'local',
        email: email,
        password: password
      })
    }
  },
  mounted () {
    Dialog.create({
      title: this.isRegistration() ? 'Register' : 'Sign In',
      form: {
        email: {
          type: 'textbox',
          label: 'E-mail',
          model: ''
        },
        password: {
          type: 'password',
          label: 'Password',
          model: ''
        }
      },
      buttons: [
        {
          label: 'Ok',
          handler: (data) => {
            if (this.isRegistration()) {
              this.register(data.email, data.password)
              .then(() => {
                return this.login(data.email, data.password)
              })
              .then(_ => {
                Toast.create.positive('You are now logged in')
              })
              .catch(_ => {
                Toast.create.negative('Cannot register, please check your e-mail or password')
                this.$router.push({ name: 'home' })
              })
            }
            else {
              this.login(data.email, data.password)
              .then(_ => {
                Toast.create.positive('You are now logged in')
              })
              .catch(_ => {
                Toast.create.negative('Cannot sign in, please check your e-mail or password')
                this.$router.push({ name: 'home' })
              })
            }
          }
        }
      ]
    })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">

</style>
