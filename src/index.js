import AudioLibrary from './audio-library'
import HackerNewsAuralizer from './hacker-news-auralizer'
import RandomSignalMapper from './random-signal-mapper'
import SignalType from './signal-type'
import SongBird from 'songbird-audio'

const LIBRARY_URLS = [
  '/sounds/wetlands/coupled/__INDEX__',
  '/sounds/wetlands/events/__INDEX__',
  '/sounds/wetlands/heartbeats/__INDEX__',
  '/sounds/wetlands/states/__INDEX__'
]

let audioCtx
let songbird
let library
let auralizer
let signalMapper

document.addEventListener('DOMContentLoaded', () => {
  // Initialize a web audio context
  audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  // Create a master volume knob
  audioCtx.masterVolume = audioCtx.createGain()
  audioCtx.masterVolume.connect(audioCtx.destination)

  // Create a Songbird 3D environment
  const dimensions = { width: 3.1, height: 2.5, depth: 3.4 }
  const materials = {
    left: 'transparent',
    right: 'transparent',
    front: 'transparent',
    back: 'brick-bare',
    down: 'grass',
    up: 'transparent'
  }
  const songbirdOpts = {
    ambisonicOrder: 3,
    listenerPosition: [0, 0, 0],
    listenerForward: [1, 0, 0],
    listenerUp: [0, 1, 0],
    dimensions: dimensions,
    materials: materials
  }
  window.songbird = songbird = new Songbird(audioCtx, songbirdOpts)
  songbird.output.connect(audioCtx.masterVolume)

  // Create a library that will act as a database of available sounds. If
  // fileExtension is not specified, raw audio will be loaded (PCM S16LE)
  library = new AudioLibrary(LIBRARY_URLS, { fileExtension: null })

  // Load the library index files
  library.load(audioCtx).then(() => {
    // Load an auralizer
    auralizer = new HackerNewsAuralizer()
    // auralizer = new RandomAuralizer()

    // Create a signal mapper to map auralizer signals to audio resources
    signalMapper = new RandomSignalMapper(auralizer, library)

    // Start loading audio resources. This is done by the signal mapper since it
    // knows which library files are actually used
    signalMapper.startLoadAudio()

    // Turn the auralizer on to enable triggering events from
    // auralizer -> signalMapper -> library
    // TODO: Queue up signals that failed to play due to undownloaded assets
    // instead of dropping them. This wait timer is a hack
    setTimeout(() => auralizer.start(), 1000)

    setupUI()
  })
})

function setupUI() {
  const muteButton = document.getElementById('mute-button')
  const unmuteButton = document.getElementById('unmute-button')

  muteButton.addEventListener('click', () => {
    muteButton.style.display = 'none'
    unmuteButton.style.display = 'inherit'
    audioCtx.masterVolume.gain.value = 0
  })

  unmuteButton.addEventListener('click', () => {
    muteButton.style.display = 'inherit'
    unmuteButton.style.display = 'none'
    audioCtx.masterVolume.gain.value = 1
  })

  document.addEventListener('play-sound', e => {
    if (e.detail.type === SignalType.STATE) {
      document.body.style.backgroundPositionX = e.detail.intensity * 100 + '%'
    }
  })
}
