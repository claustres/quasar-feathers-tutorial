# Combining the power of [Quasar](http://quasar-framework.org/) and [Feathers](http://feathersjs.com/) to build real-time web apps

A couple of days ago I 've started looking at what could be the foundation to build good-looking real-time web apps for new projects. Starting from a [Angular 1.x](https://angularjs.org/) background I was looking for something based on new Javascript standards (TypeScript, ES2015, ES2016, etc.), lightweight and easy to learn, as well as having less to do with the big players. I found [Vue.js](https://vuejs.org/) that mostly satisfy all these criteria. However, it missed a built-in component library, which brings me naturally to find [Quasar](http://quasar-framework.org/). 

Then I looked for something similar to handle the most basic tasks of creating real-time web apps on the server-side, I dreamed of a framework handling indifferently REST/socket API calls, with built-in support for most authentication schemes, being database/transport agnostic so that I could develop microservices powering different technologies. I naturally found [Feathers](https://blog.feathersjs.com/introducing-feathers-2-0-aae8ae8e7920), which additionnaly provides all of this with a plugin based architecture around a minimalist core.

I decided to start building a basic real-time chat app intensively inspired from https://github.com/feathersjs/feathers-chat (many thanks to the Feathers team for their great material):

[![Authentication video](https://img.youtube.com/vi/_iqnjpQ9gRo/0.jpg)](https://www.youtube.com/watch?v=_iqnjpQ9gRo)
[![Chat video](https://img.youtube.com/vi/te1w33vaDXI/0.jpg)](https://www.youtube.com/watch?v=te1w33vaDXI)

## Contributors

This tutorial has been enhanced and maintained thanks to the following contributors:
* [Christophe Nouguier](https://github.com/cnouguier)
* [Leo van den Bulck](https://github.com/leob)

## Disclaimer

Although this tutorial details the path to create an application skeleton featuring Quasar and Feathers from scratch, as well as code details, most of this work is currently under integration in the Quasar ecosystem. Indeed, Quasar provides the **wrapper** concept which allows to plug the frontend app into a larger piece of work such as Electron or Express powered backend. The simplest way to retrieve an up-to-date version and start with this application skeleton is to use the Quasar Feathers wrapper guide https://github.com/quasarframework/quasar-wrapper-feathersjs-api.

You can also download the source code of the app by cloning this repo and jump in the **quasar-feathers** directory:
```
git clone https://github.com/claustres/quasar-feathers-tutorial
cd quasar-feathers-tutorial
cd quasar-feathers
npm/yarn install
quasar dev
// Then in another terminal
cd api
npm/yarn install
npm run dev
```
Open your browser on `localhost:8080`. 

Last but not least, I assume your are familiar with the [Vue.js](https://vuejs.org/) and [Node.js](https://nodejs.org) ecosystem.

## Installation and configuration

**This tutorial has been upgraded to Quasar version 0.14.7 and Feathers version 3.0.5 (Buzzard).**

The way we did the migration to the new Feathers and Quasar is detailed in [this](https://medium.com/@leob6/feathers-buzzard-a-short-migration-guide-61182cf8361e) blog article.

This tutorial has been initially made with Quasar version 0.13.4 and Feathers version 2.1.1. You can find previous version in the [releases](https://github.com/claustres/quasar-feathers-tutorial/releases).

Feel free to submit any problem by opening an [Issue](https://github.com/claustres/quasar-feathers-tutorial/issues) or upgrade the code with a [Pull Request](https://github.com/claustres/quasar-feathers-tutorial/pulls).

Each framework provides its own CLI so that starting a project is easy, with a couple of instructions you have everything ready to start coding your app.

Quasar for the frontend:
```bash
$ npm install -g quasar-cli
$ quasar init quasar-feathers
$ cd quasar-feathers
$ npm install
// Will launch the frontend server in dev mode on 8080 (note: this is equivalent to: "npm run dev")
$ quasar dev
```

Or run it with npm instead of quasar:
```bash
$ npm run dev
```

Feathers for the backend in the app root directory:
```bash
$ npm install -g feathers-cli
$ mkdir api
$ cd api
// For latest Feathers (Auk release)
$ feathers generate app
$ feathers generate authentication
// For legacy Feathers (Pre-Auk releases)
$ feathers generate
// Will launch the backend server in dev mode on 3030
$ npm start
```

The default [NeDB](https://github.com/louischatriot/nedb) datastore is fine for our tutorial because it does not rely on any third-party DB software to be installed. Because we generated the Feathers boilerplate with authentication we already have a **user** service providing [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations as well. But as we want to develop a chat application we miss a **message** service so we generate it in the backend folder:
```bash
feathers generate service
```

To make the Quasar app correctly contacting the backend you have to configure an API proxy in your frontend **config/index.js**:
```javascript
...
  dev: {
    proxyTable: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true
      }
    }
    ...
```

## API glue

Feathers provides you with a thin layer on the client-side to make API authentication and calls so simple. We create a new **src/api.js** file in the frontend to handle the glue with the API:
```javascript
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

const socket = io('http://localhost:3030', {transports: ['websocket']})

const api = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))

api.service('/users')
api.service('/messages')

export default api
```

Now the API is easy to integrate in any component to perform the various tasks we need, e.g.:
```javascript
import api from 'src/api'
const users = api.service('users')
// Authenticate
api.authenticate({
  strategy: 'local',
  email: email,
  password: password
}).then(_ => {
  Toast.create.positive('Authenticated')
})
// Get all users
users.find().then((response) => {
  this.$data.users = response.data
})
// Listen to user events
users.on('created', user => {
  this.$data.users = this.$data.users.concat(user)
})
```

## Main layout

From a end-user perspective the application will be simple:
 - a menu toolbar including (**src/components/Index.vue** component)
   - a sign in/register entry when not connected
   - home/chat entries and a signout menu to logout when connected
 - a sidebar menu recalling the home/chat entries and a about section
 - a landing home page displaying different text depending on the connection state (**src/components/Home.vue** component)
 - a signin/register form with email/password (**src/components/SignIn.vue** component)
 - a chat view listing available users and providing real-time messages read/write (**src/components/Chat.vue** component)
 
 The main app layout is already part of the Quasar default template so we will directly modify it but additional components can be generated using the CLI:
 ```bash
 $ quasar new component Home
 $ quasar new component SignIn
 $ quasar new component Chat
 ```
 
 We update the layout of the **src/components/Index.vue** template to include a [Toolbar with some entries](http://quasar-framework.org/components/toolbar.html), a logout [button](http://quasar-framework.org/components/button.html), a [Sidebar menu](http://quasar-framework.org/components/layout.html#Navigation-from-drawer-panels) and an [entry point for other components](https://router.vuejs.org/en/api/router-view.html):
 ```html
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
  ```
 
 We update the router configuration in **src/router.js** to reflect this as well:
 ```javascript
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
 ```
 
## Authentication

### Backend

In the boilerplate a [local authentication strategy](https://docs.feathersjs.com/authentication/local.html) has been setup based on a [JSON Web Token](https://docs.feathersjs.com/authentication/token.html) in **api/src/authentication.js**:
```javascript
const authentication = require('feathers-authentication')
const jwt = require('feathers-authentication-jwt')
const local = require('feathers-authentication-local')

module.exports = function() {
  const app = this
  const config = app.get('authentication')

  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local())
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  })
}
```

### Frontend

On the frontend we setup the **src/components/SignIn.vue** component as a [basic dialog](http://quasar-framework.org/components/dialog.html) with e-mail/password inputs:
```javascript
import { Toast, Dialog } from 'quasar'
import api from 'src/api'

export default {
...
  mounted () {
    Dialog.create({
      title: this.isRegistration() ? 'Register' : 'Sign In',
      form: {
        email: {
          type: 'email',
          label: 'E-mail',
          model: ''
        },
        password: {
          type: 'password',
          label: 'Password',
          model: ''
        }
      },
      onDismiss: () => {
        this.$router.push({ name: 'home' })
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
  }
...
```
The final version will manage registration as well depending on the route used to reach the component but you've got the idea.

Once connected the user should land on the home page then be able to navigate in the app, so that in the main layout we have to track the login state as the currently connected user in **$data.user** (null if not logged in). We will also manage logout from the profile menu entry and restoring the previous session if any by trying to authenticate on mounting **src/components/Index.vue**:
```javascript
import { Toast } from 'quasar'
import api from 'src/api'

export default {
...
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
  }
...
```

We make the current user available to sub components easily using a **user** [prop](https://vuejs.org/v2/guide/components.html#Props) in the index component template:
```html
<router-view :user="user"></router-view>
```

## Real-time chat

Now most of the skeleton is in place the main feature of our app remains to be developed.

### Backend

In the boilerplate we generated a basic model for our messages and datastore in **api/src/models/messages.model.js**:
```javascript
const NeDB = require('nedb')
const path = require('path')

module.exports = function(app) {
  const dbPath = app.get('nedb')
  const Model = new NeDB({
    filename: path.join(dbPath, 'messages.db'),
    autoload: true
  })

  return Model
}
```

We then add a [hook](https://docs.feathersjs.com/hooks/readme.html) in **api/src/hooks/process-message.js** to automatically process messages on creation in order to:
- do some basic escaping of the content
- add the creation date
- add the ID of the user that created it

```javascript
module.exports = function() {
  return function(hook) {
    // The authenticated user
    const user = hook.params.user
    // The actual message text
    const text = hook.data.text
      // Messages can't be longer than 400 characters
      .substring(0, 400)
      // Do some basic HTML escaping
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    // Override the original data
    hook.data = {
      text,
      // Set the user id
      userId: user._id,
      // Add the current time via `getTime`
      createdAt: new Date().getTime()
    }
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook)
  }
}
```
We include this hook for our messages, as well as the one for authentication and the one to automatically populate the user that created the message, in **api/src/services/messages/messages.hooks.js**:
```javascript
const { authenticate } = require('feathers-authentication').hooks
const { populate } = require('feathers-hooks-common')
const processMessage = require('../../hooks/process-message')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ processMessage() ],
    update: [ processMessage() ],
    patch: [ processMessage() ],
    remove: []
  },
  after: {
    all: [
      populate({
        schema: {
          include: [{
            service: 'users',
            nameAs: 'user',
            parentField: 'userId',
            childField: '_id'
          }]
        }
      })
    ],
    ...
  },
  error: {
    ...
  }
}

```

One more [hook](https://docs.feathersjs.com/hooks/readme.html) in **api/src/hooks/gravatar.js** will help us provide each user with his [Gravatar](https://www.gravatar.com/) in order to have a beautiful picture in the chat view:
```javascript
// We need this to create the MD5 hash
const crypto = require('crypto')
// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar'
// The size query. Our chat needs 60px images
const query = 's=200'

module.exports = function() {
  return function(hook) {
    // The user email
    const { email } = hook.data
    // Gravatar uses MD5 hashes from an email address to get the image
    const hash = crypto.createHash('md5').update(email).digest('hex')
    hook.data.avatar = `${gravatarUrl}/${hash}?${query}`
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook);
  }
}
```
We include this hook for our users, as well as the one for authentication (except to be able to create a user when registering), in **api/src/services/users/users.hooks.js**:
```javascript
const { authenticate } = require('feathers-authentication').hooks
const { hashPassword } = require('feathers-authentication-local').hooks
const commonHooks  = require('feathers-hooks-common')
const gravatar = require('../../hooks/gravatar')

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [hashPassword(), gravatar()],
    update: [ authenticate('jwt') ],
    patch: [ authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },
  after: {
    all: [commonHooks.when(hook => hook.params.provider, commonHooks.discard('password'))],
    ...
  },
  error: {
    ...
  }
}

```

### Frontend

Helpfully Quasar comes with a built-in [chat component](http://quasar-framework.org/components/chat.html) that we will use to display our messages. We will also use the built-in [list](http://quasar-framework.org/components/lists-and-list-items.html) to list available people. Last, we will use a simple [text input](http://quasar-framework.org/components/input.html#Labeling) to send messages in the chat room. Inside the component these data are respectively stored in **$data.messages**, **$data.users**, **$data.message**. The final template of the **src/components/Chat.vue** component is thus the following:
```html
  <div>
    <div class="row">
      <div class="layout-padding col-8" >
        <q-chat-message v-for="message in messages" 
          :text="[message.text]"
          :avatar="message.user.avatar"
          :stamp="messageDate(message)"
          :sent="isSent(message) ? true : false"
        />
      </div>
      <q-list highlight class="col-auto">
        <q-list-header>People</q-list-header>
        <q-item v-for="user in users">
          <q-item-side :avatar="user.avatar" />
          <q-item-main>
            <q-item-tile label>{{user.email}}</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile icon="chat_bubble" color="green" />
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    <q-input class="row col-12 fixed-bottom" 
      v-model="message"
      v-on:keyup.enter="send"
      type="textarea"
      float-label="Enter your message"
      :min-rows="1"
    />
  </div>
```

As you can see we rely on the Quasar [positioning classes](http://quasar-framework.org/components/positioning.html) to make the message input be fixed at the bottom of the page.

Retrieving messages/users on mount and in real-time is a piece of cake in **src/components/Chat.vue**:
```javascript
...
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
      this.$data.messages.unshift(message)
    })
    // Add new users to the user list
    users.on('created', user => {
      this.$data.users = this.$data.users.concat(user)
    })
  }
...
```

## Conclusion

I hope that, like me, you measure the power of Quasar and Feathers to create beautiful real-time apps in seconds !
