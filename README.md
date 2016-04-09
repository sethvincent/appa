# appa

Quickly build micro services.

[![Travis](https://img.shields.io/travis/sethvincent/appa.svg)](https://travis-ci.org/sethvincent/appa)
[![npm](https://img.shields.io/npm/v/appa.svg)](http://npmjs.com/appa)

![appa](https://raw.githubusercontent.com/sethvincent/appa/master/appa.jpg)

## Install

Make sure you've got [node installed](http://nodejs.org), then make `appa` a project dependency:

    npm install --save appa

## Minimal example

```js
var http = require('http')
var app = require('appa')()

app.on('/', function (req, res, context) {
  app.send(res, { message: 'oh hey friends' })
})

http.createServer(app).listen(3000)
```

## API

### app

The request, response handler that is passed to `http.createServer`, and that
provides methods for your app.

**Parameters**

-   `req` **Object** – the http request object
-   `res` **Object** – the http response object

### createApp

Create the application. Returns the `app` function that can be passed into `http.createServer`.

**Parameters**

-   `options` **Object** 
    -   `options.log` **Function** – a logging function, defaults to `console.log`

### on

Route handler

**Parameters**

-   `pathname` **String** – the route for this handler
-   `callback` **Function** – the route handler

### send

Send a JSON response

**Parameters**

-   `res` **Object** – the http response object
-   `statusCode` **Number** – the status code of the response, default is 200
-   `data` **Object** – the data that will be stringified into JSON

### sendError

Send a JSON error response

**Parameters**

-   `response` **Object** – the http response object
-   `res`  
-   `statusCode` **Number** – the status code of the response, default is 404
-   `message` **String** – the message that will be stringified into JSON

## License

[MIT](LICENSE.md)
