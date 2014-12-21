
var assert = require('assert')
var express = require('express')
var request = require('supertest')

var polyfills = require('..')

var chrome = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'

describe('GET /polyfill.js', function () {
  it('should return the polyfill with a chrome user agent', function (done) {
    var server = createServer()

    request(server)
    .get('/polyfill.js')
    .set('User-Agent', chrome)
    .expect(200)
    .expect('Content-Type', /application\/javascript/)
    .end(done)
  })

  it('should support maxage', function (done) {
    var server = createServer({
      maxAge: '2 days'
    })

    request(server)
    .get('/polyfill.js')
    .set('User-Agent', chrome)
    .expect(200)
    .expect('Cache-Control', /\b172800\b/)
    .expect('Content-Type', /application\/javascript/, done)
  })
})

describe('HEAD /polyfill.js', function () {
  it('should return the headers', function (done) {
    var server = createServer()

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
    var server = createServer()

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
  var server = createServer()

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
    var server = createServer()

    request(server)
    .get('/')
    .expect(404, done)
  })
})

function createServer(options) {
  return require('express')().use(polyfills(options)).listen()
}
