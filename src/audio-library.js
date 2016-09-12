
class AudioLibrary {
  constructor (indexUrls, options = {}) {
    this.indexUrls = indexUrls
    this.options = options
    this.coupledSounds = []
    this.eventSounds = []
    this.heartbeatSounds = []
    this.stateSounds = []
  }

  load (audioCtx) {
    return Promise.all(
      this.indexUrls.map(url => Utils.request(url)
        .then(data => this.parseIndexFile(audioCtx, data, url)))
    ).then(() => {
      console.log(
        `Loaded ${this.coupledSounds.length} coupled sounds, ` +
        `${this.eventSounds.length} event sounds, ` +
        `${this.heartbeatSounds.length} heartbeat sounds, ` +
        `and ${this.stateSounds.length} state sounds`)
    })
  }

  parseIndexFile (audioCtx, data, url) {
    const baseUrl = url.replace(/__INDEX__$/, '')

    data = data.replace(/<!--[\s\S]*-->/g, '') // Strip comments
    const parsed = libraryParser.parse(data)

    parsed.forEach(dataEntry => {
      const libraryEntry = {}
      dataEntry.content.forEach(property => libraryEntry[property.name] = property.content)
      libraryEntry.baseUrl = baseUrl
      if (this.options.fileExtension) libraryEntry.fileExtension = this.options.fileExtension

      switch (dataEntry.name) {
        case 'couple':
          // TODO: Create a new CoupleSound but push it into this.eventSounds
          break
        case 'event':
          this.eventSounds.push(new EventSound(audioCtx, libraryEntry))
          break
        case 'heartbeat':
          this.heartbeatSounds.push(new HeartbeatSound(audioCtx, libraryEntry))
          break
        case 'state':
          this.stateSounds.push(new StateSound(audioCtx, libraryEntry))
          break
        default:
          console.warn('Unhandled __INDEX__ entry type ' + dataEntry.name)
          break
      }
    })
  }
}
