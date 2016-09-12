
class StateSound extends ISound {
  constructor (audioCtx, libraryEntry) {
    super(audioCtx, libraryEntry)

    const count = Math.max(1, parseInt(libraryEntry.segments, 10) || 0)
    const ext = libraryEntry.fileExtension || ''

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
    const curTime = audioCtx.currentTime
    while (this.sources.length && this.sources[0].endTime <= curTime)
      this.sources.shift()

    // Cancel and remove upcoming scheduled segments
    this.sources.slice(1).forEach(source => {
      source.gainNode.gain.cancelScheduledValues(0)
      source.stop(0)
    })
    this.sources = this.sources.slice(0, 1)

    let curSource = this.sources[0]
    if (!curSource) {
      // No currently playing segment, find the next available
      const curSegment = this.nextSegment()
      if (!curSegment) return console.warn(`Did not play StateSound ${this.name}, no loaded segments`)

      curSource = StateSound.playWithCrossfade(this.audioCtx, curSegment, 0, intensity)
      this.sources.push(curSource)
    } else if (curSource.gain !== intensity) {
      // Change the volume of the current playing segment
      StateSound.changeVolume(this.audioCtx, curSource, intensity)
    }

    // Schedule the next segment for playback
    const nextSegment = this.nextSegment()
    const offset = Math.max(0.1, curSource.endTime - curTime - StateSound.FADE_TIME)
    const nextSource = StateSound.playWithCrossfade(this.audioCtx, nextSegment, offset, intensity)
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

  static playWithCrossfade (audioCtx, segment, offset, gain) {
    const curTime = audioCtx.currentTime
    const duration = segment.audio.duration

    const source = audioCtx.createBufferSource()
    source.buffer = segment.audio

    const fadeIn = Utils.fadeInCurve(gain)
    const fadeOut = Utils.fadeOutCurve(gain)
    const gainNode = audioCtx.createGain()
    gainNode.gain.setValueCurveAtTime(fadeIn, curTime + offset, StateSound.FADE_TIME)
    gainNode.gain.setValueCurveAtTime(fadeOut, curTime + offset + duration - StateSound.FADE_TIME, StateSound.FADE_TIME)

    source.connect(gainNode)
    gainNode.connect(audioCtx.masterVolume)

    source.start(curTime + offset)
    source.stop(curTime + offset + duration)

    source.gain = gain
    source.gainNode = gainNode
    source.segment = segment
    source.endTime = curTime + offset + duration
    return source
  }

  static changeVolume (audioCtx, source, gain) {
    const curTime = audioCtx.currentTime
    const fadeOutStart = source.endTime - StateSound.FADE_TIME
    if (curTime >= fadeOutStart) return

    // Create a linear ramp from the current gain to target gain. Make sure the
    // volume change completes before we start fade-out
    const gainNode = source.gainNode
    const linearRampEnd = Math.min(fadeOutStart, curTime + StateSound.FADE_TIME)
    gainNode.gain.cancelScheduledValues(0)
    gainNode.gain.setValueAtTime(gainNode.gain.value, curTime)
    gainNode.gain.linearRampToValueAtTime(gain, linearRampEnd)

    // Rebuild the fade-out curve to start from the target gain
    const fadeOut = Utils.fadeOutCurve(gain)
    gainNode.gain.setValueCurveAtTime(fadeOut, fadeOutStart, StateSound.FADE_TIME)
  }
}

StateSound.FADE_TIME = 1.0
