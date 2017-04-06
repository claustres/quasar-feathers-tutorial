<template>
  <div class="layout">
    <div class="row fit">
      <div class="width-4of5">
        <div v-for="message in messages" v-bind:class="messageClass(message)" style="margin: 50px;">
          <div class="chat-user">
            <img :src="message.user.avatar">
          </div>
          <div class="chat-date">
            {{messageDate(message)}}
          </div>
          <div class="chat-message">
            <p>
              {{message.text}}
            </p>
          </div>
        </div>
        <div class="fixed-bottom" style="border-top: 1px solid #f4f4f4; background-color: #FFF;">
          <div class="floating-label">
            <input required class="full-width" v-model="message" v-on:keyup.enter="send">
            <label>Enter your message</label>
          </div>
        </div>
      </div>
      <div class="list content-center">
        <div class="list-label">People</div>
        <div v-for="user in users" class="item">
          <img class="item-primary" :src="user.avatar">
          <div class="item-content has-secondary">
            {{user.email}}
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import api from 'src/api'

export default {
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: []
    }
  },
  computed: {
  },
  methods: {
    messageClass (message) {
      return {
        'chat-you': (message.userId === this.user._id),
        'chat-other': (message.userId !== this.user._id)
      }
    },
    messageDate (message) {
      return moment(message.createdAt).format('MMM Do, hh:mm:ss')
    },
    send () {
      if (this.$data.message) {
        api.service('messages').create({ text: this.$data.message }).then(() => {
          this.$data.message = ''
        })
      }
    }
  },
  mounted () {
    const messages = api.service('messages')
    const users = api.service('users')

    // Get all users and messages
    messages.find({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    })
    .then((response) => {
      // We want the latest messages but in the reversed order
      this.$data.messages = response.data.reverse()
    })
    users.find()
    .then((response) => {
      this.$data.users = response.data
    })

    // Add new messages to the message list
    messages.on('created', message => {
      console.log('message received')
      this.$data.messages.unshift(message)
    })
    // Add new users to the user list
    users.on('created', user => {
      console.log('user received')
      this.$data.users = this.$data.users.concat(user)
    })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">

</style>
