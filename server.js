
var app = require('express')()

var polyfills = require('./')

app.use(polyfills())
app.use(function (req, res) {
  res.send('<!DOCTYPE html><html><head><script src="/polyfill.js"></script></head><body></body></html>')
})

var port = process.env.PORT || 3413
app.listen(port, function (err) {
  if (err) throw err
  console.log('listening on port %s', port)
})
