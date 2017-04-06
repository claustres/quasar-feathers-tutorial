const logger = require('winston')
const Server = require('./server').Server

let server = new Server()

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.run().then( () => {
  logger.info(' Server listen at ' + server.app.get('port').toString())
})
