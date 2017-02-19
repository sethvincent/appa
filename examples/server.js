var http = require('http')
var app = require('../index')()
var send = require('../send')
var error = require('../error')
var log = app.log

app.on('/', function (req, res, ctx) {
  if (req.method === 'POST') {
    console.log(ctx.body)
    return send(200, ctx.body).pipe(res)
  } else if (req.method === 'GET') {
    return send(200, { message: 'oh hey friends' }).pipe(res)
  }

  return error(400, 'Method not allowed').pipe(res)
})

http.createServer(app).listen(3000, function () {
  log.info('server started at http://127.0.0.1:3000')
})
