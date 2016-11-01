var assert = require('assert')
var qs = require('qs')
var url = require('url')
var parse = require('body/json')
var createRouter = require('wayfarer')
var isType = require('type-is')
var httplogger = require('pino-http')

var createLogger = require('./log')
var send = require('./send')
var error = require('./error')

/**
* Create the application. Returns the `app` function that can be passed into `http.createServer`.
* @name createApp
* @param {Object} options
*/
module.exports = function createApp (options) {
  options = options || {}
  options.log = options.log || { level: 'info' }

  var router = app.router = createRouter('/404')

  var log = createLogger(options.log)
  var httplog = httplogger(options.log, options.log.stream)

  // provide a 404 fallback
  on('/404', (options.notFound || notFound))
  function notFound (req, res) { error('Not found').pipe(res) }

  // ignore favicon.ico requests
  on('/favicon.ico', function (req, res) { send(200).pipe(res) })

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
    assert.equal(typeof pathname, 'string', 'appa: pathname is required and must be a string')
    assert.equal(typeof callback, 'function', 'appa: callback function is required')

    return router.on(pathname, function (params, req, res, ctx) {
      ctx.params = params
      log.info(ctx)

      function handleParse (err, body) {
        if (err) return error(400, 'Bad Request, invalid JSON').pipe(res)
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

  /**
  * Send a JSON object as a response
  * @name app.send
  * @param {Number} statusCode – the status code of the response, default is 200
  * @param {Object} data – the data that will be stringified into JSON
  * @example
  * var send = require('appa/send')
  *
  * app.on('/', function (req, res, ctx) {
  *   send({ message: 'hi' }).pipe(res)
  * })
  */
  app.send = send

  /**
  * Send a JSON error response
  * @name app.error
  * @param {Number} statusCode – the status code of the response, default is 404
  * @param {String} message – the message that will be stringified into JSON
  * @param {Object} data – additional data about the error to send in the response
  * @example
  * var error = require('appa/error')
  *
  * app.on('/', function (req, res, ctx) {
  *   error(404, 'Resource not found').pipe(res)
  * })
  */
  app.error = error

  app.on = on
  return app
}
