
class Utils {
  static fileExtension (path) {
    const match = path.match(/\.[^.]+$/)
    return match ? match[0] : undefined
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static request (url, responseType) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.responseType = responseType || 'text'

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response)
        } else {
          reject({ status: this.status, statusText: xhr.statusText })
        }
      }
      xhr.onerror = function () {
        reject({ status: this.status, statusText: xhr.statusText })
      }

      xhr.send()
    })
  }

  static shuffled (array) {
    array = array.slice(0)
    let j, x, i
    for (i = array.length; i; i--) {
        j = Math.floor(Utils.prng.random() * i)
        x = array[i - 1]
        array[i - 1] = array[j]
        array[j] = x
    }
    return array
  }

  static zeroPad(str, len) {
    str = '' + str
    while (str.length < len) str = '0' + str
    return str
  }
}

// Shared pseudo-random number generator
Utils.prng = new MersenneTwister()

// Equal power crossfade curves
Utils.FADE_IN = new Float32Array(4096).map((_, i) => Math.cos((1 - i / 4096) * 0.5 * Math.PI))
Utils.FADE_OUT = new Float32Array(4096).map((_, i) => Math.cos((i / 4096) * 0.5 * Math.PI))

// Shims

Object.values = Object.values || function values (obj) {
  const vals = []
  for (let key in obj) {
    vals.push(obj[key])
  }
  return vals
}
