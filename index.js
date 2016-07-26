var qs = require('qs')
var url = require('url')
var parse = require('body/json')
var response = require('response')
var createRouter = require('wayfarer')
var isType = require('type-is')
var logger = require('pino')
var httplogger = require('pino-http')
var xtend = require('xtend')

/**
* Create the application. Returns the `app` function that can be passed into `http.createServer`.
* @name createApp
* @param {Object} options
*/
module.exports = function createApp (options) {
  options = options || {}
  options.log = options.log || { level: 'info' }

  var router = app.router = createRouter('/404')
  var log = logger(options.log, options.log.stream)
  var httplog = httplogger(options.log, options.log.stream)

  // provide a 404 fallback
  on('/404', (options.notFound || notFound))
  function notFound (req, res) { error(res, 'Not found') }

  // ignore favicon.ico requests
  on('/favicon.ico', function (req, res) { send(res, 200) })

  /**
  * The request, response handler that is passed to `http.createServer`, and the object that
  * provides methods for your app.
  * @name app
  * @param {Object} req – the http request object
  * @param {Object} res – the http response object
  */
  function app (req, res) {
    httplog(req, res)
    var parsed = url.parse(req.url)
    parsed.query = qs.parse(parsed.query)
    return router(parsed.pathname, req, res, parsed)
  }

  /**
  * Route handler
  * @name app.on
  * @param {String} pathname – the route for this handler
  * @param {Function} callback – the route handler
  */
  function on (pathname, callback) {
    return router.on(pathname, function (params, req, res, ctx) {
      ctx.params = params
      log.info(ctx)

      function handleParse (err, body) {
        if (err) return error(res, 400, 'Bad Request, invalid JSON')
        ctx.body = body
        callback(req, res, ctx)
      }

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (isType(req, ['json'])) return parse(req, res, handleParse)
        return callback(req, res, ctx)
      }

      callback(req, res, ctx)
    })
  }

  /**
  * Send a JSON object as a response
  * @name app.send
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
  * @name app.error
  * @param {Object} response – the http response object
  * @param {Number} statusCode – the status code of the response, default is 404
  * @param {String} message – the message that will be stringified into JSON
  * @param {Object} data – additional data about the error to send in the response
  */
  function error (res, statusCode, message, data) {
    if (typeof statusCode === 'string') {
      data = message
      message = statusCode
      statusCode = 404
    }

    data = data || {}
    data = xtend(data, { statusCode: statusCode, message: message })
    log.error(data, message)
    return send(res, statusCode, data)
  }

  /**
  * Create logs using the pino module: https://npmjs.com/pino
  * @name app.log
  */
  app.log = log

  /**
  * Parse or stringify a JSON stream using the JSONStream module: https://npmjs.com/JSONStream
  * @name app.json
  */
  app.json = require('JSONStream')

  /**
  * Compose a stream using the pump module: https://npmjs.com/pump
  * @name app.pipe
  */
  app.pipe = require('pump')

  app.on = on
  app.send = send
  app.error = error
  return app
}
