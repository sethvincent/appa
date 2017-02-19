var request = require('request')

var host = 'http://127.0.0.1:3000/'

function post (cb) {
  request({
    url: host,
    method: 'POST',
    json: { message: 'hi' }
  }, cb)
}

function get (cb) {
  request({
    url: host,
    method: 'GET',
    json: true
  }, cb)
}

function destroy (cb) {
  request({
    url: host,
    method: 'DELETE',
    json: true
  }, cb)
}

post(function (err, res, body) {
  if (err) console.log(err)
  console.log(res.statusCode, body)

  get(function (err, res, body) {
    if (err) console.log(err)
    console.log(res.statusCode, body)

    destroy(function (err, res, body) {
      if (err) console.log(err)
      console.log(res.statusCode, body)
    })
  })
})
