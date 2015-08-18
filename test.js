var test = require('tape')

var http = require('http')
var request = require('request')
var createAppa = require('./index')

function example () {
  return {
    name: 'example',
    serve: function (req, res) {
      res.writeHead(200)
      return res.end('example')
    }
  }
}

test('add and remove an app', function (t) {
  var server = createAppa()
  server.add(example)
  t.ok(server.apps)
  t.ok(server.apps.example)
  t.ok(server.apps.example.serve)
  server.remove(example)
  t.notOk(server.apps.example)
  t.end()
})

test('get a response from an app', function (t) {
  var appa = createAppa({ apps: [example] })
  var server = http.createServer(appa)
  server.listen(appa.url.port, function () {
    request('http://127.0.0.1:4323', function (err, res, body) {
      t.notOk(err)
      t.ok(res)
      t.equals(body, 'example')
      server.close()
      t.end()
    })
  })
})
