const ProgressBar = require('progress')

let bar
let req = require('request').get('http://downloads.sourceforge.net/project/peep/Peep-sounds/0.4.0/Peep-Sounds.0.4.0.tar.gz')

req.on('data', chunk => {
  bar = bar || new ProgressBar('Downloading... [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 25,
    total: parseInt(req.response.headers['content-length']),
  })
  bar.tick(chunk.length)
})
.pipe(require('zlib').createGunzip())
.pipe(require('tar-fs').extract('./'))
.on('close', err => {
  bar.tick(bar.total - bar.curr)
  if (err) return console.error(err)
  console.log('Unpacked sounds to ./sounds/wetlands')
})
