
class RandomAuralizer extends IAuralizer {
  get eventSignals () { return RandomAuralizer.EVENTS }
  get heartbeatSignals () { return RandomAuralizer.HEARTBEATS }
  get stateSignals () { return RandomAuralizer.STATES }

  start () {
    this.eventTick()
    this.heartbeatTick()
    this.stateTick()
  }

  eventTick () { this.tick(SignalType.EVENT, RandomAuralizer.EVENTS, this.eventTick) }
  heartbeatTick () { this.tick(SignalType.HEARTBEAT, RandomAuralizer.HEARTBEATS, this.heartbeatTick) }
  stateTick () { this.tick(SignalType.STATE, RandomAuralizer.STATES, this.stateTick) }

  tick (type, array, method) {
    const signal = array[Utils.randomInt(0, array.length - 1)]
    const intensity = Utils.prng.random()
    const hash = 0
    if (this.callback) this.callback(type, signal, intensity, hash)

    setTimeout(method.bind(this), Utils.prng.random() * 1000 * 10)
  }
}

RandomAuralizer.EVENTS = [ 'event1', 'event2', 'event3', 'event4', 'event5' ]
RandomAuralizer.HEARTBEATS = [ 'heartbeat1' ]
RandomAuralizer.STATES = [ 'state1', 'state2' ]
