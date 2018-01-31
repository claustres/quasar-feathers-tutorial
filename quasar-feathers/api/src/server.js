const path = require('path')
const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const proxyMiddleware = require('http-proxy-middleware')

const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration')
const rest = require('@feathersjs/express/rest')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const channels = require('./channels');
const appHooks = require('./main.hooks')

const authentication = require('./authentication')

export class Server {
  constructor() {
    this.app = express(feathers())
    // Load app configuration
    this.app.configure(configuration(path.join(__dirname, '..')))

    // Serve pure static assets
    if (process.env.NODE_ENV === 'production') {
      this.app.use(this.app.get('client').build.publicPath, express.static('../dist'))
    }
    else {
      const staticsPath = path.posix.join(this.app.get('client').dev.publicPath, 'statics/')
      this.app.use(staticsPath, express.static('../client/statics'))
    }

    // Define HTTP proxies to your custom API backend. See /config/index.js -> proxyTable
    // https://github.com/chimurai/http-proxy-middleware
    Object.keys(this.app.get('proxyTable')).forEach( (context) => {
      let options = this.config.this.app.get('proxyTable')[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      this.app.use(proxyMiddleware(context, options))
    })

    // Enable CORS, security, compression, favicon and body parsing
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(compress())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    // Set up Plugins and providers
    this.app.configure(rest())
    this.app.configure(socketio())

    this.app.configure(authentication)

    // Set up our services (see `services/index.js`)
    this.app.configure(services)
    this.app.configure(channels);
    // Configure middleware (see `middleware/index.js`) - always has to be last
    this.app.configure(middleware)
    this.app.hooks(appHooks)
  }

  run () {
    const port = this.app.get('port');

    let promise = new Promise((resolve, reject) => {
      this.app.listen(port, (err) => {
        if (err) {
          reject(err)
        }
        else {
          resolve()
        }
      })
    })

    return promise
  }
}
