var test = require('tape')
var tp = require('../')

var sampleTorrent = {
  title: 'ubuntu-14.04.3-desktop-i386.iso',
  category: 'ALL',
  seeds: 1196,
  leechs: 19,
  size: 1064304640,
  hash: '58ad8b464a0a4114e1890492543b6388d50af04a'
}

test('search with some options', function (t) {
  t.plan(11)

  var options = { limit: 3, filter: 'pc', order: 'sizeD' }

  tp.search('arch', options, function (err, result) {
    t.error(err, 'no error')
    t.ok(result.total >= result.torrents.length, 'has correct total')
    t.equals(result.torrents.length, options.limit, 'has correct limit')
    t.equals(result.torrents[1].category, options.filter, 'seems to filter correctly')
    t.ok(result.torrents[0].size >= result.torrents[1].size, 'seems to sort correctly')
    for (var key in sampleTorrent) {
      t.ok(result.torrents[0].hasOwnProperty(key), 'has key: ' + key)
    }
    t.end()
  })
})

test('receive trackers from torrent', function (t) {
  t.plan(3)

  tp.trackers(sampleTorrent, function (err, trackers) {
    t.error(err, 'no error')
    t.ok(trackers.length > 0, 'has elements')
    t.ok(/:\/\//.test(trackers[0]), 'which are trackers?')
    t.end()
  })
})

test('receive trackers from infohash', function (t) {
  t.plan(3)

  tp.trackers('58ad8b464a0a4114e1890492543b6388d50af04a', function (err, trackers) {
    t.error(err, 'no error')
    t.ok(trackers.length > 0, 'has elements')
    t.ok(/:\/\//.test(trackers[0]), 'which are trackers?')
    t.end()
  })
})

test('receive peers from torrent', function (t) {
  t.plan(3)

  tp.peers(sampleTorrent, function (err, peers) {
    t.error(err, 'no error')
    t.ok(peers.seeds, 'has seeders')
    t.ok(peers.leechs, 'hass leechers')
    t.end()
  })
})

test('receive peers from infohash', function (t) {
  t.plan(3)

  tp.peers('58ad8b464a0a4114e1890492543b6388d50af04a', function (err, peers) {
    t.error(err, 'no error')
    t.ok(peers.seeds, 'has seeders')
    t.ok(peers.leechs, 'hass leechers')
    t.end()
  })
})

test('make magnet with trackers', function (t) {
  t.plan(3)

  var magnet = 'magnet:?xt=urn:btih:58ad8b464a0a4114e1890492543b6388d50af04a&dn=ubuntu-14.04.3-desktop-i386.iso'

  tp.magnet(sampleTorrent, function (err, link) {
    t.error(err, 'no error')
    t.equals(magnet, link.substring(0, magnet.length), 'correct infohash and name')
    t.ok(/tr=/.test(link.substring(magnet.length)), 'contains trackers')
    t.end()
  })
})
