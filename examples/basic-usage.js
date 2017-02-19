var http = require('http')
var app = require('../index')()
var send = require('../send')
var log = app.log

app.on('/', function (req, res, ctx) {
  send(200, { message: 'oh hey friends' }).pipe(res)
})

http.createServer(app).listen(3000, function () {
  log.info('server started at http://127.0.0.1:3000')
})
