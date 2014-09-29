
var fresh = require('fresh')
var destroy = require('destroy')
var accepts = require('accepts')
var parse = require('url').parse
var onFinished = require('on-finished')
var Polyfills = require('push-polyfills')

module.exports = function (options) {
  options = options || {}
  var polyfill = require('polyfills')(options)

  var minify = options.minify != null
    ? options.minify
    : process.env.NODE_ENV === 'production'

  var maxAge = options.maxage || options.maxAge || '14 days'
  if (typeof maxAge === 'string') maxAge = require('ms')(maxAge)
  maxAge = Math.round(maxAge / 1000)
  var cacheControl = 'public, max-age=' + maxAge

  var path = options.path || '/polyfill.js'

  return function (req, res, next) {
    res.polyfills = new Polyfills(polyfill, req, res, {
      cacheControl: cacheControl,
      minify: minify
    })

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

    return polyfill(req.headers['user-agent']).then(function (data) {
      var info = polyfill.select(data, minify, accepts(req).encodings('gzip') === 'gzip')
      var ext = info[0]

      res.setHeader('Cache-Control', cacheControl)
      res.setHeader('Content-Encoding', info[1] ? 'gzip' : 'identity')
      res.setHeader('Content-Length', data.length[ext])
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8')
      res.setHeader('ETag', '"' + data.hash + '"')
      res.setHeader('Vary', 'Accept-Encoding, User-Agent')

      if (req.method === 'HEAD') {
        res.statusCode = 200
        res.end()
        return
      }

      if (fresh(req.headers, res._headers)) {
        res.statusCode = 304
        res.end()
        return
      }

      var stream = polyfill.stream(data.name, ext)
      stream.on('error', next).pipe(res)
      onFinished(res, function () {
        destroy(stream)
      })
    }).catch(next)
  }
}
