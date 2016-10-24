var logger = require('pino')

module.exports = function createLogger (options) {
  options = options || { level: 'info' }
  return logger(options, options.stream)
}
