
# polyfills-middleware

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

[Polyfills](https://github.com/polyfills/polyfills) middleware for Express, Connect, etc.
Uses the `req, res, next` signature.
Simply add a `<script src="/polyfill.js"></script>` to your HTML pages
and you've got all the polyfills you could ever need!

## API

```js
app.use(require('polyfills-middleware')(options))
```

Options are:

- `maxAge` - defaults to `14 days`

The [other options](https://github.com/polyfills/polyfills#var-polyfill--polyfillsoptions) are `include` and `exclude`.

[npm-image]: https://img.shields.io/npm/v/polyfills-middleware.svg?style=flat-square
[npm-url]: https://npmjs.org/package/polyfills-middleware
[github-tag]: http://img.shields.io/github/tag/polyfills/middleware.svg?style=flat-square
[github-url]: https://github.com/polyfills/middleware/tags
[travis-image]: https://img.shields.io/travis/polyfills/middleware.svg?style=flat-square
[travis-url]: https://travis-ci.org/polyfills/middleware
[coveralls-image]: https://img.shields.io/coveralls/polyfills/middleware.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/polyfills/middleware?branch=master
[david-image]: http://img.shields.io/david/polyfills/middleware.svg?style=flat-square
[david-url]: https://david-dm.org/polyfills/middleware
[license-image]: http://img.shields.io/npm/l/polyfills-middleware.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/polyfills-middleware.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/polyfills-middleware
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
