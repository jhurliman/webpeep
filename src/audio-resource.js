
class AudioResource {
  constructor (audioCtx, url) {
    this.audioCtx = audioCtx
    this.url = url
    this.loading = false
    this.audio = null
  }

  load () {
    if (this.loading || this.audio) return
    this.loading = true

    return Utils.request(this.url, 'arraybuffer')
    .then(buffer => AudioResource.bufferToAudio(this.audioCtx, buffer, this.url))
    .then(audioBuffer => {
      this.loading = false
      this.audio = audioBuffer
      console.log(`Loaded ${this.audio.duration.toFixed(2)} second clip from ${this.url}`)
      return this.audio
    })
  }

  static bufferToAudio (audioCtx, buffer, url) {
    let raw = true
    switch (Utils.fileExtension(url)) {
      case '.flac':
      case '.m4a':
      case '.mp3':
      case '.mp4':
      case '.oga':
      case '.ogg':
      case '.wav':
        raw = false
        break
    }

    if (raw) {
      const pcm16 = new Int16Array(buffer)
      const pcmFloat = new Float32Array(pcm16.length)
      pcmFloat.set(pcm16)
      pcmFloat.forEach((x, i) => pcmFloat[i] = x / 0x7fff)

      const audio = audioCtx.createBuffer(1, pcmFloat.length, 44100)
      audio.copyToChannel(pcmFloat, 0)
      return Promise.resolve(audio)
    } else {
      return audioCtx.decodeAudioData(buffer)
    }
  }
}
