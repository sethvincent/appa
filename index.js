var qs = require('qs')
var parse = require('body/json')
var response = require('response')
var createRouter = require('match-routes')
var isType = require('type-is')

/**
* Create the application. Returns the `app` function that can be passed into `http.createServer`.
* @name createApp
* @param {Object} options
*/
module.exports = function createApp (options) {
  options = options || {}
  var router = createRouter()

  /**
  * The request, response handler that is passed to `http.createServer`, and that
  * provides methods for your app.
  * @name app
  * @param {Object} req – the http request object
  * @param {Object} res – the http response object
  */
  function app (req, res) {
    if (router.match(req, res)) return
    else error(res, 404, 'Not Found')
  }

  /**
  * Route handler
  * @name on
  * @param {String} pathname – the route for this handler
  * @param {Function} callback – the route handler
  */
  function on (pathname, callback) {
    return router.on(pathname, function (req, res, context) {
      context.query = qs.parse(context.query)

      function handleParse (err, body) {
        if (err) {
          return error(res, 400, 'Bad Request, invalid JSON')
        }

        context.body = body
        callback(req, res, context)
      }

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (isType(req, ['json'])) return parse(req, res, handleParse)
        return callback(req, res, context)
      }

      callback(req, res, context)
    })
  }

  /**
  * Send a JSON response
  * @name send
  * @param {Object} res – the http response object
  * @param {Number} statusCode – the status code of the response, default is 200
  * @param {Object} data – the data that will be stringified into JSON
  */
  function send (res, statusCode, data) {
    if (typeof statusCode === 'object') {
      data = statusCode
      statusCode = 200
    }

    return response.json(data).status(statusCode).pipe(res)
  }

  /**
  * Send a JSON error response
  * @param {Object} response – the http response object
  * @param {Number} statusCode – the status code of the response, default is 404
  * @param {String} message – the message that will be stringified into JSON
  */
  function error (res, statusCode, message) {
    if (typeof statusCode === 'object') {
      message = statusCode
      statusCode = 404
    }

    return send(res, statusCode, { statusCode: statusCode, message: message })
  }

  app.on = on
  app.send = send
  app.error = error
  app.router = router
  app.json = require('JSONStream')
  app.pipe = require('pump')
  return app
}
