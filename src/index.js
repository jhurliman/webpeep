
const LIBRARY_URLS = [
  'https://d1b1y29frn0aw8.cloudfront.net/wetlands/coupled/__INDEX__',
  'https://d1b1y29frn0aw8.cloudfront.net/wetlands/events/__INDEX__',
  'https://d1b1y29frn0aw8.cloudfront.net/wetlands/heartbeats/__INDEX__',
  'https://d1b1y29frn0aw8.cloudfront.net/wetlands/states/__INDEX__',
]

let audioCtx
let library
let auralizer
let signalMapper

document.addEventListener('DOMContentLoaded', () => {
  // Initialize a web audio context
  audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  // Create a master volume knob
  audioCtx.masterVolume = audioCtx.createGain()
  audioCtx.masterVolume.connect(audioCtx.destination)

  // Create a library that will act as a database of available sounds. If
  // fileExtension is not specified, raw audio will be loaded (PCM S16LE)
  library = new AudioLibrary(LIBRARY_URLS, { fileExtension: '.m4a' })

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

function setupUI () {
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
}
