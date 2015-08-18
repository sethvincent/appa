# appa

Build an API service from a collection of modules that each provide a single resource.

![appa](https://github.com/sethvincent/appa/blob/master/appa.jpg)

## Warning: what even is this i don't know

This project is created from the experimenting I've been doing creating API services in node without a framework.

I've found that some glue code that lumps together and serves all the API endpoints is useful, and this is an approach for doing that.

It's likely that the approach for serving the routes is inadequate, but hopefully that's what you'll help me decide. 

Have an opinion? Open an issue. I'd like to hear your thoughts. Check out the contributing guidelines first though: [CONTRIBUTING.md](CONTRIBUTING.md).

## Notice: this should not become another framework

It's so tempting to build a bunch of helpers into this server object that `appa` provides. 

But that should be avoided. Help me avoid that by either:
- **A:** showing me a better way than this sillyness (that does not include using express/hapi)
- **B:** building more cool http modules with single purposes (I'm happy to team up on such projects and I'm inspired by work like [jshttp](https://github.com/jshttp) and [http-framework](https://github.com/Raynos/http-framework))

**Hey isn't this a framework though?**

The only thing `appa` does right now is keep track of a collection of modules that each provide API endpoints. Those API endpoints could potentially be written with express, hapi, restify, or whatever approach you like to use with node.

## Oops: wait why am i doing this

I like experiments. That's why.

Also, I really like the `appa` logo. Here it is again in case you missed it:

![appa](https://github.com/sethvincent/appa/blob/master/appa.jpg)

## So what is this really?

`appa` has a few primary qualities:

- lets you manage a collection of "apps" that each provide a single resource via json API
- has no opinions about the modules you use to write those apps
- requires that at minimum each of these apps has a structure like this:

```js
module.exports = function example (server) {
  return {
    name: 'example',
    serve: function (req, res) {
      // handle the requests with whatever router you want
      // the only requirement is that when a route matches,
      // this function returns with a truthy value
    }
  }
}
```

## Install

Make sure you've got node installed, then make `appa` a project dependency:

```
npm install --save appa
```

## Usage examples

### Pass `appa` to `http.createServer`

```js
var http = require('http')
var appa = require('appa')({ 
  url: 'http://localhost:3333'
})

http.createServer(appa).listen(appa.url.port)
```

The above code won't do anything. Not until you add an app:

```js
var http = require('http')
var appa = require('appa')({ 
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

http.createServer(appa).listen(appa.url.port)
```

Now every route returns the string `example`. Not very interesting.

### A server with two apps

Here's a slightly more complicated example:

```js
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

http.createServer(appa).listen(appa.url.port)
```

Note that we're passing the two apps as an array to the `apps` option in the constructor:

```js
var appa = require('../index')({
  url: 'http://localhost:3333',
  apps: [index, example]
})
```

Also notice that the order matters. `appa` will check each app in the order that they are added, so the `index` app will be checked for matching routes first, then `example`. If `example` were the first item in the array, our server would be stuck responding with `example` to all requests. This is probably the worst feature of `appa`.

### An example using a router module and a response module

This example adds a few more elements, and is starting to get complicated enough that each app should be broken out into its own file:

```js
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

http.createServer(appa).listen(appa.url.port)
```

## License

[MIT](LICENSE.md)