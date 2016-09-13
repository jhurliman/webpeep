import AudioResource from './audio-resource'
import ISound from './isound'
import Utils from './utils'

export default class StateSound extends ISound {
  constructor (audioCtx, libraryEntry) {
    super(audioCtx, libraryEntry)

    const count = Math.max(1, parseInt(libraryEntry.segments, 10) || 0)
    const ext = libraryEntry.fileExtension || ''

    // Create a shared gain node for this StateSound so we can adjust intensity
    // without touching fade-in / fade-out curves
    this.stateGain = audioCtx.createGain()
    this.stateGain.connect(audioCtx.masterVolume)

    this.name = libraryEntry.name
    this.segments = Array.apply(null, Array(count)).map((_, i) => {
      // {baseUrl}{name}.{nn}{fileExtension}
      const url = `${libraryEntry.baseUrl}${this.name}.${Utils.zeroPad(i + 1, 2)}${ext}`

      const segment = new AudioResource(audioCtx, url)
      segment.index = i
      return segment
    })
    this.sources = []
    this.timer = null
  }

  load () {
    this.segments.forEach(segment => segment.load())
  }

  play (intensity = 0.5, hash = 0) {
    console.log(`[StateSound] ${this.name} gain=${intensity} hash=${hash}`)
    this.doPlay(intensity, hash)
  }

  doPlay (intensity, hash) {
    // Remove already played segments
    const curTime = this.audioCtx.currentTime
    while (this.sources.length && this.sources[0].endTime <= curTime)
      this.sources.shift()

    // Cancel and remove upcoming scheduled segments
    this.sources.slice(1).forEach(source => source.stop(0))
    this.sources = this.sources.slice(0, 1)

    let curSource = this.sources[0]
    if (!curSource) {
      // No currently playing segment, find the next available
      const curSegment = this.nextSegment()
      if (!curSegment) return console.warn(`Did not play StateSound ${this.name}, no loaded segments`)

      curSource = this.playWithCrossfade(curSegment, 0, intensity)
      this.sources.push(curSource)
    } else if (this.stateGain.gain.value !== intensity) {
      // Change the volume of the current playing segment
      const sharedGain = this.stateGain.gain
      sharedGain.cancelScheduledValues(curTime)
      sharedGain.setValueAtTime(sharedGain.value, curTime)
      sharedGain.linearRampToValueAtTime(intensity, curTime + StateSound.VOLUME_CHANGE_TIME)
    }

    // Schedule the next segment for playback
    const nextSegment = this.nextSegment()
    const offset = Math.max(0.1, curSource.endTime - curTime - StateSound.FADE_TIME)
    const nextSource = this.playWithCrossfade(nextSegment, offset, intensity)
    this.sources.push(nextSource)

    // Run this method again right after the current segment finishes to
    // schedule another segment
    clearTimeout(this.timer)
    this.timer = setTimeout(() => { this.doPlay(intensity, hash) },
      (curSource.endTime - curTime + 0.1) * 1000)
  }

  nextSegment () {
    const curSegment = this.sources.length ? this.sources[0].segment : undefined
    const segments = Utils.shuffled(this.segments)

    // Prefer a segment that is not the current playing segment
    for (let segment of segments) {
      if (segment !== curSegment && segment.audio) return segment
    }

    // Fall back to using the current segment, or undefined if there is none
    return curSegment
  }

  playWithCrossfade (segment, offset, gain) {
    const curTime = this.audioCtx.currentTime
    const duration = segment.audio.duration

    const source = this.audioCtx.createBufferSource()
    source.buffer = segment.audio

    // Create a gain node with fade-in / fade-out curves
    const fadeInTime = curTime + offset
    const fadeOutTime = curTime + offset + duration - StateSound.FADE_TIME
    const gainNode = this.audioCtx.createGain()
    gainNode.gain.setValueCurveAtTime(Utils.FADE_IN, fadeInTime, StateSound.FADE_TIME)
    gainNode.gain.setValueCurveAtTime(Utils.FADE_OUT, fadeOutTime, StateSound.FADE_TIME)

    source.connect(gainNode)
    gainNode.connect(this.stateGain)

    source.start(curTime + offset)
    source.stop(curTime + offset + duration)

    source.segment = segment
    source.endTime = curTime + offset + duration
    return source
  }
}

StateSound.FADE_TIME = 1.0
StateSound.VOLUME_CHANGE_TIME = 3.0
