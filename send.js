var response = require('response')

module.exports = function send (statusCode, data) {
  if (typeof statusCode === 'object') {
    data = statusCode
    statusCode = 200
  }

  return response.json(data).status(statusCode)
}
