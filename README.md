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

### createApp

Create the application. Returns the `app` function that can be passed into `http.createServer`.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.log` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** – whether appa should log using bole. default: true

### app

The request, response handler that is passed to `http.createServer`, and that
provides methods for your app.

**Parameters**

-   `req` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http request object
-   `res` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http response object

### on

Route handler

**Parameters**

-   `pathname` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – the route for this handler
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – the route handler

### send

Send a JSON response

**Parameters**

-   `res` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http response object
-   `statusCode` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** – the status code of the response, default is 200
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the data that will be stringified into JSON

### error

Send a JSON error response

**Parameters**

-   `response` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http response object
-   `res`  
-   `statusCode` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** – the status code of the response, default is 404
-   `message` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – the message that will be stringified into JSON

## License

[MIT](LICENSE.md)
