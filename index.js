var assert = require('assert')
var qs = require('qs')
var url = require('url')
var rawBody = require('raw-body')
var createRouter = require('wayfarer')
var isType = require('type-is')
var httplogger = require('pino-http')

var createLogger = require('./log')
var send = require('./send')
var error = require('./error')

/**
* Create the application. Returns the `app` function that can be passed into `http.createServer`.
* @name createApp
* @param {Object} config
* @param {Object|Boolean} config.log – Set to `false` to disable logging. Set to an object with options that are passed to [pino](https://npmjs.com/pino) and [pino-http](https://npmjs.com/pino-http)
* @param {Function} config.notFound – Function that handlers 404 routes. Provides `req`, `res`, and `ctx` arguments just like other appa route handlers. Default: a function that sends a `404` statusCode with the message `Not found`.
* @returns {Function} `app`
* @example
* var appa = require('appa')
*
* var app = appa({
*   log: { level: 'info' }, // or set to `false` to disable all logging
*   notFound: function (req, res, ctx) {
*     return app.error(404, 'Not Found').pipe(res)
*   }
* })
*/
module.exports = function createApp (config) {
  config = config || {}

  config.log = config.log === false
    ? { level: 'silent' }
    : config.log || { level: 'info' }

  var log = createLogger(config.log)
  var httplog = httplogger(config.log, config.log.stream)
  var router = app.router = createRouter('/404')

  // provide a 404 fallback
  on('/404', (config.notFound || notFound))
  function notFound (req, res) { error('Not found').pipe(res) }

  // ignore favicon.ico requests
  on('/favicon.ico', function (req, res) { send(200).pipe(res) })

  /**
  * The request, response handler that is passed to `http.createServer`, and the object that
  * provides methods for your app.
  * @name app
  * @param {Object} req – the http request object
  * @param {Object} res – the http response object
  * @example
  * var http = require('http')
  * var appa = require('appa')
  *
  * var app = appa()
  * var server = http.createServer(app)
  */
  function app (req, res) {
    httplog(req, res)
    var ctx = url.parse(req.url)
    ctx.query = qs.parse(ctx.query)
    return router(ctx.pathname, req, res, ctx)
  }

  /**
  * Route handler
  * @name app.on
  * @param {String} pathname – the route for this handler
  * @param {Object} options – options for the request handler
  * @param {Boolean} options.parseJSON – optionally disable JSON parsing of the body. Default: `true`
  * @param {Function} callback – the route handler
  * @example
  * app.on('/', function (req, res, ctx) {
  *   // handle the route
  * })
  */
  function on (pathname, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    assert.equal(typeof pathname, 'string', 'appa: pathname is required and must be a string')
    assert.equal(typeof options, 'object', 'appa: options must be an object')
    assert.equal(typeof callback, 'function', 'appa: callback function is required')

    options.parseJSON = options.parseJSON === false ? options.parseJSON : true

    return router.on(pathname, function (params, req, res, ctx) {
      ctx.params = params
      log.info(ctx)

      function respond (req, res, ctx) {
        try {
          return callback(req, res, ctx)
        } catch (e) {
          return error(500, 'Internal server error', e).pipe(res)
        }
      }

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        body(req, options, function (err, result) {
          if (err) return error(err.status, err.type).pipe(res)

          if (isType(req, ['json']) && options.parseJSON) {
            ctx.body = parseJSON(res, result)
          } else {
            ctx.body = result
          }

          return respond(req, res, ctx)
        })
      }

      return respond(req, res, ctx)
    })
  }

  function parseJSON (res, result) {
    try {
      return JSON.parse(result)
    } catch (err) {
      return error(400, 'Invalid JSON').pipe(res)
    }
  }

  function body (req, options, callback) {
    if (!options.limit) options.limit = '1mb'
    if (!options.encoding) options.encoding = 'utf8'
    rawBody(req, options, callback)
  }

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
  return app
}
