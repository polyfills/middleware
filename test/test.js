
var assert = require('assert')
var request = require('supertest')

require('polyfills')().clean()

var polyfills = require('..')
var options = {}
var etag

var chrome = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'

var server = require('http').createServer(function (req, res) {
  polyfills(options)(req, res, function (err) {
    if (err) {
      res.statusCode = err.status || 500
      res.end(err.message)
      return
    }

    res.statusCode = 404
    res.end()
  })
})

describe('GET /polyfill.js', function () {
  it('should return the polyfill with a chrome user agent', function (done) {
    request(server)
    .get('/polyfill.js')
    .set('User-Agent', chrome)
    .expect(200)
    .expect('Content-Encoding', 'gzip')
    .expect('Content-Type', /application\/javascript/)
    .end(function (err, res) {
      assert.ifError(err)
      // assert(!/\bPromise\b/.test(res.text))
      done()
    })
  })

  it('should minify with minify: true', function (done) {
    options = {
      minify: true
    }

    request(server)
    .get('/polyfill.js')
    .set('User-Agent', chrome)
    .expect(200)
    .expect('Content-Encoding', 'gzip')
    .expect('Content-Type', /application\/javascript/)
    .end(function (err, res) {
      assert.ifError(err)
      assert(!/\}\s{2,}/.test(res.text))
      etag = res.headers.etag
      done()
    })
  })

  it('should respect the etag', function (done) {
    request(server)
    .get('/polyfill.js')
    .set('User-Agent', chrome)
    .set('if-none-match', etag)
    .expect(304)
    .expect('Content-Type', /application\/javascript/)
    .expect('', done)
  })

  it('should support maxage', function (done) {
    options.maxAge = '1 day'

    request(server)
    .get('/polyfill.js')
    .set('User-Agent', chrome)
    .expect(200)
    .expect('Cache-Control', /\b86400\b/)
    .expect('Content-Type', /application\/javascript/, done)
  })
})

describe('HEAD /polyfill.js', function () {
  it('should return the headers', function (done) {
    request(server)
    .head('/polyfill.js')
    .set('User-Agent', chrome)
    .expect(200)
    .expect('Content-Type', /application\/javascript/)
    .expect('', done)
  })
})

describe('OPTIONS /polyfill.js', function () {
  it('should 204', function (done) {
    request(server)
    .options('/polyfill.js')
    .set('User-Agent', chrome)
    .expect('Allow', /\bHEAD\b/)
    .expect('Allow', /\bGET\b/)
    .expect('Allow', /\bOPTIONS\b/)
    .expect(204, done)
  })
})

describe('PATCH /polyfills.js', function () {
  it('should 405', function (done) {
    request(server)
    .patch('/polyfill.js')
    .set('User-Agent', chrome)
    .expect('Allow', /\bHEAD\b/)
    .expect('Allow', /\bGET\b/)
    .expect('Allow', /\bOPTIONS\b/)
    .expect(405, done)
  })
})

describe('GET /', function () {
  it('should 404', function (done) {
    request(server)
    .get('/')
    .expect(404, done)
  })
})
