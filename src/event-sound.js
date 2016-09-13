import AudioResource from './audio-resource'
import ISound from './isound'
import MersenneTwister from './mersenne-twister'
import Utils from './utils'

export default class EventSound extends ISound {
  constructor (audioCtx, libraryEntry) {
    super(audioCtx, libraryEntry)

    const count = Math.max(1, parseInt(libraryEntry.segments, 10) || 0)
    const ext = libraryEntry.fileExtension || ''

    this.name = libraryEntry.name
    this.segments = Array.apply(null, Array(count)).map((_, i) => {
      // {baseUrl}{name}.{nn}{fileExtension}
      const url = `${libraryEntry.baseUrl}${this.name}.${Utils.zeroPad(i + 1, 2)}${ext}`
      return new AudioResource(audioCtx, url)
    })
  }

  load () {
    this.segments.forEach(segment => segment.load())
  }

  play (intensity = 0.5, hash = 0) {
    console.log(`[EventSound] ${this.name} gain=${intensity} hash=${hash}`)

    // Convert hash into a position in our unit cube world
    const prng = new MersenneTwister(hash)
    const origin = { x: prng.random() - 0.5, y: 0, z: prng.random() - 0.5 }

    // Find all of the segments to play
    const segments = this.playableSegments()
    if (!segments.length) return console.warn(`Did not play EventSound ${this.name}, no loaded segments`)

    EventSound.playOneShot(this.audioCtx, segments, intensity, origin)
  }

  playableSegments () {
    return this.segments.filter(s => s.audio)
  }

  static playOneShot (audioCtx, segments, gain, origin) {
    const spatialNode = audioCtx.createPanner()
    spatialNode.refDistance = 0.001
    spatialNode.maxDistance = 1
    spatialNode.rolloffFactor = 0.01
    spatialNode.coneInnerAngle = 360
    spatialNode.setOrientation(0 - origin.x, 0 - origin.y, 0 - origin.z)
    spatialNode.setPosition(origin.x, origin.y, origin.z)

    const gainNode = audioCtx.createGain()
    gainNode.gain.value = gain

    spatialNode.connect(gainNode)
    gainNode.connect(audioCtx.masterVolume)

    let time = audioCtx.currentTime
    segments.forEach(segment => {
      const source = audioCtx.createBufferSource()
      source.buffer = segment.audio

      source.connect(spatialNode)
      source.start(time)

      time += segment.audio.duration
      source.stop(time)
    })
  }
}
