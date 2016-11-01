var xtend = require('xtend')
var send = require('./send')

module.exports = function error (statusCode, message, data) {
  if (typeof statusCode === 'string') {
    data = message
    message = statusCode
    statusCode = 404
  }

  data = data || {}
  data = xtend(data, { statusCode: statusCode, message: message })
  return send(statusCode, data)
}
