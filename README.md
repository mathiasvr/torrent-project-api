# Torrent Project API [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/torrent-project-api.svg
[npm-url]: https://www.npmjs.com/package/torrent-project-api

Torrent search API for [torrentproject.se](https://torrentproject.se)

## install

```
npm install torrent-project-api
```

## example

```js
var tp = require('torrent-project-api')

tp.search('ubuntu', function (err, result) {
  if (err) return console.error(err)

  console.log('Found ' + result.torrents.length + ' torrents out of ' + result.total + ' results.')

  console.log('The top result was: ' + result.torrents[0].title)

  tp.magnet(result.torrents[0], function (err, link) {
    if (err) return console.error(err)
    console.log('Here is a magnet link for it:')
    console.log(link)
  })
})
```

The `result` object looks like this:

```js
{ total: 18427,
  torrents: [
    { title: 'ubuntu-14.04.3-desktop-amd64.iso',
      category: 'ALL',
      seeds: 3226,
      leechs: 59,
      size: 1054867456,
      hash: '743bc6fad39e3a35460d31af5322c131dd196ac2' },
    { ... }
  ]
}
```

## usage

### search

Search for torrents

```js
var query = ['key', 'words']        // array or string

var options = {
  limit: 10,                        // amount of results (1-100)
  order: 'peers',                   // sort order
  filter: 'tv'                      // filter by category
}

tp.search(query, options, callback) // or simply tp(...)
```

Sort order for `options.order` can be found in `tp.orderings`:
> `best`, `latest`, `seeders`, `oldest`, `speed`, `peers`, `sizeD`, `sizeA`

Categories for `options.filter` can be found in `tp.filters`:
> `all`, `audio`, `lossless`, `mp3`, `video`, `tv`, `dvdrip`, `hdrip`, `dvd`, `lq`, `ebooks`, `comics`, `magazines`, `tutorials`, `audiobook`, `images`, `mobile`, `games`, `pc`, `nintendo`, `playstation`, `xbox`, `applications`, `adult`

### magnet

Get magnet link for `result.torrents[]`

```js
tp.magnet(torrent, function (err, link) { })
```

The returned magnet `link`:
> magnet:?xt=urn:btih:743bc6fad39e3a35460d31af5322c131dd196ac2&dn=ubuntu-14.04.3-desktop-amd64.iso&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fgalliumsurfer.tk%3A6969%2Fannounce

### trackers

Receive a list of trackers from `result.torrents[]` or `infohash`

```js
tp.trackers(torrent, function (err, trackers) { })
```

Returns list of `trackers`:
```js
[ 'udp://tracker.leechers-paradise.org:6969/announce', 'udp://galliumsurfer.tk:6969/announce', ... ]
```
### peers

Receive amount of seeders and peers from `result.torrents[]` or `infohash`

```js
tp.peers('743bc6fad39e3a35460d31af5322c131dd196ac2', function (err, peers) { })
```

Returns list of `peers`:
```js
{ seeds: '3226', leechs: '59' }
```

## license

MIT