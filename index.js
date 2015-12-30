var qs = require('querystring')
var _ = require('lodash')
var apiRequest = require('./lib/api-request')
var parameters = require('./lib/parameters')

function torrentProject () {
  return torrentProject.search.apply(this, arguments)
}

torrentProject.search = function (words, options, callback) {
  if (_.isFunction(options)) return torrentProject.search(words, {}, options)

  apiRequest({
    params: {
      s: !_.isString(words) ? words.join('+') : words.trim().replace(/\s+/g, '+'),
      out: 'json',
      orderby: options.order,
      num: parameters.limit(options.limit),
      filter: _.isString(options.filter) ? parameters.filters[options.filter] : options.filter
    }
  }, function (error, json) {
    return !error
      ? callback(null, _normalize(json, options.limit))
      : callback(error)
  })
}

torrentProject.trackers = function (torrent, callback) {
  apiRequest.meta(torrent, '/trackers_json', callback)
}

torrentProject.peers = function (torrent, callback) {
  apiRequest.meta(torrent, '/peers', function (error, peers) {
    return !error
      ? callback(null, _.zipObject(['seeds', 'leechs'], peers.split(':')))
      : callback(error)
  })
}

torrentProject.magnet = function (torrent, callback) {
  var link = 'magnet:?xt=urn:btih:' + torrent.hash + '&'

  torrentProject.trackers(torrent, function (error, trackers) {
    return !error
      ? callback(null, link + qs.stringify({ dn: torrent.title, tr: trackers }))
      : callback(new Error('failed to add trackers'), link + qs.stringify({ dn: torrent.title }))
  })
}

// note: the json data is assumed to have a specific format.
function _normalize (json, limit) {
  var result = { total: parseInt(json['total_found'], 10), torrents: [] }

  // skip total_found key, or limit further
  var count = Math.min(Object.keys(json).length - 1, limit || 200)

  // convert object to array
  for (var i = 0; i < count; i++) {
    result.torrents[i] = {}
    Object.keys(json[i + 1]).forEach(function (key) {
      // rename some keys
      result.torrents[i][key.replace('torrent_', '')] = json[i + 1][key]
    })
    result.torrents[i].category = result.torrents[i].category.toLowerCase()
  }

  return result
}

// export filters and orderings for convenience
torrentProject.filters = Object.keys(parameters.filters)
torrentProject.orderings = parameters.orderings

module.exports = torrentProject
