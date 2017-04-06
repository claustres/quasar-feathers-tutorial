<template>
  <div>
    <div class="layout-padding">
      <div v-if="!authenticated">
        <div class="column items-center">
          <div class="auto"><img src="~assets/quasar-logo.png"></div>
          <div class="auto">
            <h3>
              </br>
              <router-link to="/signin">Sign In</router-link> or <router-link to="/register">Register</router-link> to see the power of Quasar and Feathers
              </br></br>
            </h3>
          </div>
          <div class="auto"><img src="~assets/feathers-logo.png"></div>
        </div>
      </div>
      <div v-else class="column items-center">
        <h5>
          To make this demo work correctly first register your avatar to <a href="https://www.gravatar.com">https://www.gravatar.com</a>
          then go to the <router-link to="/chat">Chat</router-link>
        </h5>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['user'],
  data () {
    return {
    }
  },
  computed: {
    authenticated () {
      return this.user !== null
    }
  },
  methods: {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">

</style>
