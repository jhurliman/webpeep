
class RandomSignalMapper extends ISignalMapper {
  constructor (auralizer, library) {
    super (auralizer, library)

    const rand1 = Utils.prng.randomInt()
    const rand2 = Utils.prng.randomInt()
    const rand3 = Utils.prng.randomInt()

    auralizer.eventSignals.forEach((signal, i, signals) => {
      this.maps.event[signal] = [ library.eventSounds[(rand1 + i) % library.eventSounds.length] ]
    })
    auralizer.heartbeatSignals.forEach((signal, i, signals) => {
      this.maps.heartbeat[signal] = [ library.heartbeatSounds[(rand2 + i) % library.heartbeatSounds.length] ]
    })
    auralizer.stateSignals.forEach((signal, i, signals) => {
      this.maps.state[signal] = [ library.stateSounds[(rand3 + i) % library.stateSounds.length] ]
    })
  }
}
