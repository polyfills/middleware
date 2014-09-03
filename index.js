
var fresh = require('fresh')
var accepts = require('accepts')
var parse = require('url').parse

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

    var gzip = accepts(req).encodings('gzip') === 'gzip'
    var ext = minify ? '.min.js' : '.js'
    if (gzip) ext += '.gz'

    return polyfill(req.headers['user-agent']).then(function (data) {
      res.setHeader('Content-Length', data.length[ext])
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      res.setHeader('ETag', '"' + data.hash + '"')
      res.setHeader('Vary', 'Accept-Encoding, User-Agent')
      if (gzip) res.setHeader('Content-Encoding', 'gzip')

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

      res.setHeader('Cache-Control', cacheControl)

      return polyfill.read(data.name, ext).then(res.end.bind(res))
    }).catch(next)
  }
}
