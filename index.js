
var parse = require('url').parse
var polyfills = require('polyfills')

module.exports = function (options) {
  options = options || {}
  var polyfill = polyfills(options)
  var loaded = false

  var maxAge = options.maxage || options.maxAge || '1 day'
  if (typeof maxAge === 'string') maxAge = require('ms')(maxAge)
  maxAge = Math.round(maxAge / 1000)
  var cacheControl = 'public, max-age=' + maxAge

  var path = options.path || '/polyfill.js'

  return [
    update,
    polyfillMiddleware
  ]

  function update(req, res, next) {
    if (loaded) return next()
    polyfills.load.then(function () {
      loaded = true
      next()
    }, next)
  }

  function polyfillMiddleware(req, res, next) {
    if (parse(req.url).pathname !== path) return next()

    switch (req.method) {
      case 'HEAD':
      case 'GET':
        break // continue
      case 'OPTIONS':
        res.setHeader('Allow', 'OPTIONS,HEAD,GET')
        res.statusCode = 204
        res.end()
        return
      default:
        res.setHeader('Allow', 'OPTIONS,HEAD,GET')
        res.statusCode = 405
        res.end('Method Not Allowed')
        return
    }

    res.setHeader('Cache-Control', cacheControl)
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8')
    res.send(polyfill(req.headers['user-agent']))
  }
}
