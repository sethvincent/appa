# appa change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

> Note: unreleased changes are listed here

## 6.1.2 - 2017-02-25

## Fixed

- fix double response bug

## 6.1.1 - 2017-02-25

## Fixed

- uncaught errors inside request handlers are now caught and a `500 Internal server error` response is sent
- Added docs to readme about error handling and logging
- update tests/README.md

## 6.1.0 - 2017-02-19

## Added
- disable logging with `var app = appa({ logging: false })`
- Improved [api docs](docs/api.md)
- refactored to use the raw-body module, which allows setting the limit of incoming request body sizes
- individual request handlers can now pass a `parseJSON: false` option to disable JSON parsing
- add [server](examples/server.js) and [client](examples/client.js) examples

## 6.0.0 - 2016-11-01

### Changed
- use `send(data).pipe(res)` rather than `send(res, data)`

## 5.0.1 - 2016-10-24

### Added
- Add a docs directory
- Add CONDUCT.md
- Add CHANGELOG.md

### Changed
- Move send, error, and log into separate files
- Revise README.md with links and updated info.
- License: MIT > ISC
- Create tests directory
