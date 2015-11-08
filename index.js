var url = require('url')

module.exports = function createAppa (options) {
  options = options || {}
  options.url = options.url ? url.parse(options.url) : url.parse('http://127.0.0.1:4323')

  function appa (req, res) {
    var keys = Object.keys(appa.apps)
    var l = keys.length
    var i = 0
    for (i; i < l; i++) {
      if (appa.apps[keys[i]].serve(req, res)) return
    }
  }

  appa.add = function appa_add (createApp) {
    if (typeof createApp !== 'function') {
      throw new Error('App error: an app must be a function that returns an object')
    }

    var app = createApp(appa)

    if (typeof app !== 'object') {
      throw new Error('App error: an app must be a function that returns an object')
    }

    if (!app.name || typeof app.name !== 'string') {
      throw new Error('App error: app must have a name property that is a string')
    }

    if (!app.serve || typeof app.serve !== 'function') {
      throw new Error('App error: app must have a serve method')
    }

    appa.apps[app.name] = app
  }

  appa.remove = function appa_remove (name) {
    if (typeof name === 'function') {
      name = name().name
    }
    delete appa.apps[name]
  }

  appa.apps = {}
  if (options.apps) {
    options.apps.forEach(function (app) {
      if (options.preRendered) {
        appa.apps[app.name] = app
      } else {
        appa.add(app)
      }
    })
  }

  appa.url = options.url
  return appa
}
