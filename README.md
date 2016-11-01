# appa

Quickly create simple JSON API services.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]
[![conduct][conduct]][conduct-url]

[npm-image]: https://img.shields.io/npm/v/appa.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/appa
[travis-image]: https://img.shields.io/travis/sethvincent/appa.svg?style=flat-square
[travis-url]: https://travis-ci.org/sethvincent/appa
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[conduct]: https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-green.svg?style=flat-square
[conduct-url]: CONDUCT.md

![appa](https://raw.githubusercontent.com/sethvincent/appa/master/appa.jpg)

## About



## Install

Make sure you've got [node installed](http://nodejs.org), then make `appa` a project dependency:

```sh
npm install --save appa
```

## Usage

```js
var http = require('http')
var app = require('appa')()
var send = require('appa/send')
var log = require('appa/log')()

app.on('/', function (req, res, context) {
  send(res, { message: 'oh hey friends' })
})

http.createServer(app).listen(3000, function () {
  log.info('server started at http://127.0.0.1:3000')
})
```

## Documentation
- [Getting started](docs/getting-started.md)
- [Related modules](docs/related-modules.md)
- [API](docs/api.md)
- [Tests](tests/)

### Examples
- [Basic example](examples/basic.js)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Conduct

It is important that this project contributes to a friendly, safe, and welcoming environment for all. Read this project's [code of conduct](CONDUCT.md)

## Changelog

Read about the changes to this project in [CHANGELOG.md](CHANGELOG.md). The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Contact

- **chat** – You can chat about this project at []()
- **issues** – Please open issues in the [issues queue](https://github.com/sethvincent/appa/issues)
- **twitter** – Have a question? [@sethdvincent](https://twitter.com/sethdvincent)
- **email** – Need in-depth support via paid contract? Send an email to sethvincent@gmail.com

## License

[ISC](LICENSE.md)
