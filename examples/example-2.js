var http = require('http')

function index (server) {
  return {
    name: 'index',
    serve: function (req, res) {
      if (req.url === '/') {
        res.writeHead(200)
        return res.end('index')
      }
    }
  }
}

function example (server) {
  return {
    name: 'example',
    serve: function (req, res) {
      res.writeHead(200)
      return res.end('example')
    }
  }
}

var appa = require('../index')({
  url: 'http://localhost:3333',
  apps: [index, example]
})

http.createServer(appa).listen(3333)
