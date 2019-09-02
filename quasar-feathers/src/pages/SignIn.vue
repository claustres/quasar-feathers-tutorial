<template>
  <q-page class="flex flex-center">
    <q-dialog name="signin-dialog" v-model="showDialog" :title="title" @ok="onOk" @hide="onHide" >
      <div slot="body">
        <div class="row q-mb-md">
          <q-input
            v-model="email" type="email" name="email" stack-label="E-mail" class="full-width" autofocus
          />
        </div>
        <div class="row">
          <q-input
            v-model="password" type="password" name="email" stack-label="Password" class="full-width"
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import auth from 'src/auth'
import { QDialog, QInput } from 'quasar'
export default {
  name: 'q-signin',
  components: {
    QDialog,
    QInput
  },
  data () {
    return {
      showDialog: true,
      email: null,
      password: null,
      title: null
    }
  },
  computed: {
  },
  methods: {
    goHome () {
      this.$router.push({ name: 'home' })
    },
    onHide () {
      // Workaround needed because of timing issues (sequencing of 'hide' and 'ok' events) ...
      setTimeout(() => {
        this.goHome()
      }, 50)
    },
    onOk (data) {
      if (this.isRegistration()) {
        this.register(this.email, this.password)
          .then(() => {
            return this.login(this.email, this.password)
          })
          .then(_ => {
            this.$q.notify({ type: 'positive', message: 'You are now logged in' })
          })
          .catch(_ => {
            this.$q.notify({ type: 'positive', message: 'Cannot register, please check your e-mail or password' })
            this.goHome()
          })
      } else {
        this.login(this.email, this.password)
          .then(_ => {
            this.$q.notify({ type: 'positive', message: 'You are now logged in' })
          })
          .catch(_ => {
            this.$q.notify({ type: 'positive', message: 'Cannot sign in, please check your e-mail or password' })
            this.goHome()
          })
      }
    },
    isRegistration () {
      return this.$route.name === 'register'
    },
    register (email, password) {
      return auth.register(email, password)
    },
    login (email, password) {
      return auth.login(email, password)
    }
  },
  mounted () {
    this.title = this.isRegistration() ? 'Register' : 'Sign In'
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">
</style>
