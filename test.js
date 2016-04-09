var test = require('tape')
var http = require('http')
var request = require('request')

var createApp = require('./index')

function createServer (app) {
  return http.createServer(app)
}

test('create a server', function (t) {
  var app = createApp()
  var server = createServer(app).listen(0, function () {
    t.ok(app)
    server.close()
    t.end()
  })
})

test('create a route', function (t) {
  t.plan(6)
  var app = createApp()

  app.on('/', function (req, res, context) {
    t.ok(req)
    t.ok(res)
    t.ok(context)
    app.send(res, { hello: 'hi' })
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131', json: true }, function (err, res, body) {
      t.notOk(err)
      t.ok(body)
      t.equal(body.hello, 'hi')
      server.close()
    })
  })
})

test('querystring is parsed', function (t) {
  t.plan(4)
  var app = createApp()

  app.on('/', function (req, res, context) {
    app.send(res, context.query)
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131?hi=hello&hey[wut]=wat', json: true }, function (err, res, body) {
      t.notOk(err)
      t.ok(body)
      t.equal(body.hi, 'hello')
      t.equal(body.hey.wut, 'wat')
      server.close()
    })
  })
})
