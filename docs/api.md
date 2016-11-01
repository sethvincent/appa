# createApp

Create the application. Returns the `app` function that can be passed into `http.createServer`.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# app

The request, response handler that is passed to `http.createServer`, and the object that
provides methods for your app.

**Parameters**

-   `req` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http request object
-   `res` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http response object

# app.on

Route handler

**Parameters**

-   `pathname` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – the route for this handler
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – the route handler

# app.log

Create logs using the pino module: <https://npmjs.com/pino>

# app.json

Parse or stringify a JSON stream using the JSONStream module: <https://npmjs.com/JSONStream>

# app.pipe

Compose a stream using the pump module: <https://npmjs.com/pump>

# app.send

Send a JSON object as a response

**Parameters**

-   `res` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http response object
-   `statusCode` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** – the status code of the response, default is 200
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the data that will be stringified into JSON

# app.error

Send a JSON error response

**Parameters**

-   `response` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – the http response object
-   `statusCode` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** – the status code of the response, default is 404
-   `message` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – the message that will be stringified into JSON
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – additional data about the error to send in the response
