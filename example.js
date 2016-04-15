var http = require('http')
var app = require('./index')()

app.on('/', function (req, res, context) {
  app.send(res, { message: 'oh hey friends' })
})

http.createServer(app).listen(3000, function () {
  app.log.info('server started at http://127.0.0.1:3000')
})
