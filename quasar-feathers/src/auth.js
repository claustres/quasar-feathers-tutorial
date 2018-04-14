import api from 'src/api'
//import { Promise } from 'es6-promise'

const auth = {

  user: null,

  getUser() {
    return this.user
  },

  fetchUser (accessToken) {

    return api.passport.verifyJWT(accessToken)
      .then(payload => {
        return api.service('users').get(payload.userId)
      })
      .then(user => {
        return Promise.resolve(user)
      })
  },

  authenticate () {
    console.log('auth')

    return api.authenticate()
      .then((response) => {
        console.log('auth successful')

        return this.fetchUser(response.accessToken)
      })
      .then(user => {
        console.log('got user')

        this.user = user

        return Promise.resolve(user)
      })
      .catch((err) => {
        console.log('auth failed', err)

        this.user = null

        return Promise.reject(err)
      })
  },

  authenticated () {
    return this.user != null
  },

  signout () {
    console.log('signout')

    return api.logout()
      .then(() => {
        console.log('signout successful')

        this.user = null
      })
      .catch((err) => {
        console.log('signout failed', err)

        return Promise.reject(err)
      })
  },

  onLogout (callback) {

    api.on('logout', () => {
      console.log('onLogout')

      this.user = null

      callback()
    })
  },

  onAuthenticated (callback) {

    api.on('authenticated', response => {
      console.log('onAuthenticate', response)

      this.fetchUser(response.accessToken)
      .then(user => {
        console.log('onAuthenticate got user')

        this.user = user

        callback(this.user)
      })
      .catch((err) => {
        console.log('onAuthenticate get user failed', err)

        callback(this.user)
      })
    })
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

}

export default auth
