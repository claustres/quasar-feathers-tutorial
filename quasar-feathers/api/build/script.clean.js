var
  shell = require('shelljs'),
  path = require('path')

shell.rm('-rf', path.resolve(__dirname, '../dist'))
console.log(' Cleaned Express build artifacts.\n')
