
class HackerNewsAuralizer extends IAuralizer {
  get eventSignals () { return HackerNewsAuralizer.EVENTS }
  get heartbeatSignals () { return HackerNewsAuralizer.HEARTBEATS }
  get stateSignals () { return HackerNewsAuralizer.STATES }

  start () {
    const config = { databaseURL: 'https://hacker-news.firebaseio.com' }
    this.hn = firebase.initializeApp(config, 'hackernews').database().ref('v0')
    this.itemCache = new LRUCache({ capacity: 1000 })
    this.topStories = null
    this.bestStories = null

    const HOUR_MS = 1000 * 60 * 60

    this.hn.child('newstories').on('value', snapshot => {
      const now = Date.now()

      const itemIDs = snapshot.val()
      if (!itemIDs || !itemIDs.length) return

      this.signal(SignalType.EVENT, 'newstories', 0.5, itemIDs[0])

      this.getItems(itemIDs.slice(0, 90)).then(items => {
        const baseVal = HackerNewsAuralizer.storiesPerHour(items, 90, now)
        const curVal = HackerNewsAuralizer.storiesPerHour(items, 30, now)

        console.log(`[HN] ${curVal.toFixed(2)}/${baseVal.toFixed(2)} stories per hour`)
        this.signal(SignalType.STATE, 'story-frequency', curVal / (baseVal * 2), items[0].time)
      })
    })

    this.hn.child('topstories').on('value', snapshot => {
      const itemIDs = snapshot.val()
      if (!itemIDs || !itemIDs.length) return

      this.signal(SignalType.EVENT, 'topstories', 0.5, itemIDs[0])

      this.getItems(itemIDs.slice(0, 30)).then(items => {
        this.topStories = items
        this.updateTrend()
      })
    })

    this.hn.child('beststories').on('value', snapshot => {
      const itemIDs = snapshot.val()
      if (!itemIDs || !itemIDs.length) return

      this.signal(SignalType.EVENT, 'beststories', 0.5, itemIDs[0])

      this.getItems(itemIDs.slice(0, 90)).then(items => {
        this.bestStories = items
        this.updateTrend()
      })
    })

    let lastUpdate = Date.now()
    this.hn.child('updates').on('value', snapshot => {
      // Track how much time passed between updates
      const now = Date.now()
      const deltaMS = now - lastUpdate
      lastUpdate = now

      const itemIDs = snapshot.val().items
      if (!itemIDs || !itemIDs.length) return

      this.signal(SignalType.EVENT, 'updates', 0.5, itemIDs[0])

      this.getItems(itemIDs).then(items => {
        const sorted = {
          jobs: [],
          stories: [],
          comments: [],
          polls: [],
        }

        items.forEach(item => {
          switch (item.type) {
            case 'job': sorted.jobs.push(item); break
            case 'story': sorted.stories.push(item); break
            case 'comment': sorted.comments.push(item); break
            case 'poll': sorted.polls.push(item); break
            default: break
          }
        })

        const signals = []
        for (let signal in sorted) {
          const array = sorted[signal]
          if (!array.length) continue

          signals.push({
            type: SignalType.EVENT,
            signal: signal,
            intensity: array.length / items.length,
            hash: array.length
          })
        }

        console.log(
          `[HN] ${sorted.jobs.length} jobs, ${sorted.stories.length} stories, ` +
          `${sorted.comments.length} comments, ${sorted.polls.length} polls`)
        if (signals.length)
          this.signalOverTime(signals, deltaMS)
      })
    })
  }

  updateTrend () {
    if (!this.topStories || !this.bestStories) return

    // Count the number of top stories that appear in the best stories list
    const bestSet = new Set(this.bestStories.map(item => item.id))
    const count = this.topStories.filter(item => bestSet.has(item.id)).length
    console.log(`[HN] ${count}/${this.topStories.length} front page stories appear in recent best`)

    // Full intensity if 1/3 or more of /topstories have made it to the last
    // few pages of /beststories
    const intensity = count / (this.topStories.length / 3)
    this.signal(SignalType.STATE, 'popular-stories', intensity, count)
  }

  getItems (itemIDs) {
    return Promise
    .all(itemIDs.map(id => this.getItem(id)))  // Retrieve all items in parallel
    .then(items => items.filter(item => item)) // Remove missing entries
  }

  getItem (itemID) {
    return new Promise((resolve, reject) => {
      // Cache check
      const cached = this.itemCache.fetch(itemID)
      if (cached) return resolve(cached)

      // Fetch from Firebase
      this.hn.child('item/' + itemID).once('value', snapshot => {
        const item = snapshot.val()
        this.itemCache.store(itemID, item)
        resolve(item)
      }, err => {
        reject(err)
      })
    })
  }

  signal (type, signal, intensity, hash = 0) {
    if (this.callback) this.callback(type, signal, intensity, hash)
  }

  signalOverTime (signals, deltaMS) {
    signals = Utils.shuffled(signals)
    const spacing = deltaMS / signals.length

    signals.forEach((s, i) => {
      const randMS = Math.max(0, spacing * i + Utils.prng.random() * deltaMS - spacing * 0.5)
      setTimeout(() => this.signal(s.type, s.signal, s.intensity, s.hash), randMS)
    })
  }

  static storiesPerHour (items, windowSize, now) {
    if (!items.length) return 0

    const count = Math.min(windowSize, items.length)
    const oldest = items[count - 1].time * 1000
    const hours = (now - oldest) / (1000 * 60 * 60)

    return count / hours
  }
}

HackerNewsAuralizer.EVENTS = [ 'jobs', 'stories', 'comments', 'polls',
  'topstories', 'beststories', 'newstories', 'updates' ]
HackerNewsAuralizer.HEARTBEATS = [] // TODO: updates should be a heartbeat
HackerNewsAuralizer.STATES = [ 'story-frequency', 'popular-stories' ]
