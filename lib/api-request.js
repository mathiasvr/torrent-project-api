var request = require('request')
var _ = require('lodash')

function apiRequest (options, callback) {
  request({
    baseUrl: 'https://torrentproject.se',
    url: options.path || '/',
    qs: options.params,
    json: true
  }, function (error, response, json) {
    return !error && response.statusCode === 200
      ? callback(null, json)
      : callback(new Error('Connection error.'))
  })
}

apiRequest.meta = function (torrent, path, callback) {
  var hash = _.isString(torrent) ? torrent.toLowerCase() : torrent.hash

  if (!_.isString(hash) || hash.length !== 40) return callback(new Error('invalid hash'))

  apiRequest({ path: hash + path }, function (error, json) {
    return !error
      ? callback(null, json)
      : callback(error)
  })
}

module.exports = apiRequest
