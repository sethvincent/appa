var qs = require('qs')
var parse = require('body/json')
var response = require('response')
var createRouter = require('match-routes')

/**
* Create the application. Returns the `app` function that can be passed into `http.createServer`.
* @name createApp
* @param {Object} options
* @param {Function} options.log – a logging function, defaults to `console.log`
*/
module.exports = function createApp (options) {
  options = options || {}
  var log = options.log || console.log
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
    else sendError(res, 404, 'Not Found')
  }

  /**
  * Route handler
  * @name on
  * @param {String} pathname – the route for this handler
  * @param {Function} callback – the route handler
  */
  function on (pathname, callback) {
    return router.on(pathname, function (req, res, context) {
      log(req.method, req.url)
      context.query = qs.parse(context.query)
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        parse(req, res, function (err, body) {
          if (err) return sendError(res, 400, 'Bad Request, invalid JSON')
          context.body = body
          callback(req, res, context)
        })
      } else {
        callback(req, res, context)
      }
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

    log('send', statusCode, data)
    return response.json(data).status(statusCode).pipe(res)
  }

  /**
  * Send a JSON error response
  * @param {Object} response – the http response object
  * @param {Number} statusCode – the status code of the response, default is 404
  * @param {String} message – the message that will be stringified into JSON
  */
  function sendError (res, statusCode, message) {
    if (typeof statusCode === 'object') {
      message = statusCode
      statusCode = 404
    }

    log('sendError', statusCode, message)
    return send(res, statusCode, { statusCode: statusCode, message: message })
  }

  app.on = on
  app.send = send
  app.error = sendError
  app.router = router
  return app
}
