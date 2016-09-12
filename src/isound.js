
class ISound {
  constructor (audioCtx, libraryEntry) {
    this.audioCtx = audioCtx
    this.duration = Number((libraryEntry.length || '').split(' ').shift()) || undefined
    this.description = libraryEntry.description
    this.suggested = libraryEntry.suggested
  }

  load () { }
  play (intensity = 0.5, hash = 0) { }
}
