var http = require('http')
var appa = require('../index')({ 
  url: 'http://localhost:3333'
})

appa.add(function () {
  return {
    name: 'example',
    serve: function (req, res) {
      res.writeHead(200)
      return res.end('example')
    }
  }
})

http.createServer(appa).listen(3333)
