var http = require('http')
var response = require('response')
var matchRoutes = require('match-routes')

function food (server) {
  return {
    name: 'food',
    serve: function (req, res) {
      var router = matchRoutes()
      router.on('/food', function (req, res, opts) {
        response().json({ food: ['pizza', 'salad', 'sushi'] }).pipe(res)
      })
      return router.match(req, res)
    }
  }
}

function hobbies (server) {
  return {
    name: 'example',
    serve: function (req, res) {
      var router = matchRoutes()
      router.on('/hobbies', function (req, res, opts) {
        response().json({ hobbies: ['fashion', 'code', 'basketball'] }).pipe(res)
      })
      return router.match(req, res)
    }
  }
}

function error (server) {
  return {
    name: 'error',
    serve: function (req, res) {
      return response().json({ error: '404 Not Found' }).status(404).pipe(res)
    }
  }
}

var appa = require('../index')({
  url: 'http://localhost:3333',
  apps: [food, hobbies, error]
})

http.createServer(appa).listen(3333)
