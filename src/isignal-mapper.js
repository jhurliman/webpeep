
export default class ISignalMapper {
  constructor (auralizer, library) {
    this.auralizer = auralizer
    this.library = library

    this.maps = {
      event: {},
      heartbeat: {},
      state: {},
    }

    auralizer.signalHandler = this.signalHandler.bind(this)
  }

  startLoadAudio () {
    Object.values(this.maps).forEach(map => {
      Object.values(map).forEach(sounds => {
        sounds.forEach(sound => sound.load())
      })
    })
  }

  signalHandler (type, signal, intensity, hash) {
    const map = this.maps[type]
    const sounds = map ? map[signal] : undefined
    if (!sounds || !sounds.length) return console.warn(`Unmapped signal ${type}:${signal}`)

    const sound = sounds[hash % sounds.length]

    intensity = Math.max(0, Math.min(1, intensity)) || 0
    hash = Number(hash) || 0

    // Broadcast an event
    const event = new CustomEvent('play-sound',
      { detail: { type: type, signal: signal, intensity: intensity, hash: hash } })
    document.dispatchEvent(event)

    // Play the sound
    sound.play(intensity, hash)
  }
}
