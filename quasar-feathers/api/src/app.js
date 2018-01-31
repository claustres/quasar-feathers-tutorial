'use strict';

const path = require('path');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const channels = require('./channels');
const appHooks = require('./main.hooks');

const authentication = require('./authentication');

const app = express(feathers());

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.configure(rest());
app.configure(socketio());

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
app.configure(channels);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

module.exports = app;
