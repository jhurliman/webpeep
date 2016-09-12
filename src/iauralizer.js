/**
 * Enum for signal types an auralizer can emit.
 * @readonly
 * @enum {string}
 */
const SignalType = {
  EVENT: 'event',
  HEARTBEAT: 'heartbeat',
  STATE: 'state',
}

/**
 * IAuralizer is a base class for auralizers which connect to external data
 * sources and emit signals that can be interpreted by the rest of the
 * application.
 */
class IAuralizer {
  get eventSignals () { return [] }
  get heartbeatSignals () { return [] }
  get stateSignals () { return [] }

  /**
   * @callback IAuralizer~signalHandler
   * @param {SignalType} type - The type of signal. event, heartbeat, state.
   * @param {string} signal - The identifier for this signal.
   * @param {number} intensity - Normalized signal intensity, [0-1].
   * @param {number} hash - An optional integer value tied to this unique event,
   *   used for spatialization.
   */

  /** @type {IAuralizer~signalHandler} */
  set signalHandler (value) { this.callback = value }

  start () {}
}
