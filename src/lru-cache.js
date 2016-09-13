
export default class LRUCache {
  constructor (options = {}) {
    this._map = {}
    this._queue = {}
    this._capacity = options.capacity || 10
    this._size = 0
  }

  store (key, value) {
    const replaced = this.delete(key)
    const queue = this._queue
    const node = { value: value, key: key }
    LRUCache.moveToLast(node, queue)
    this._map[key] = node
    this._size += 1
    if (this._size > this._capacity)
      this.delete(this._queue.first.key)
    return replaced
  }

  fetch (key) {
    const node = this._map[key]
    if (node === undefined) return undefined
    LRUCache.detachFromQueue(node, this._queue)
    LRUCache.moveToLast(node, this._queue)
    return node.value
  }

  delete (key) {
    const node = this._map[key]
    if (node === undefined) return false

    LRUCache.detachFromQueue(node, this._queue)
    delete this._map[key]
    this._size -= 1
    return true
  }

  static detachFromQueue (node, queue) {
    if (node === queue.first)
      queue.first = node.next
    if (node === queue.last)
      queue.last = node.prev
    if (node.prev)
      node.prev.next = node.next
    if (node.next)
      node.next.prev = node.prev
  }

  static moveToLast (node, queue) {
    node.prev = queue.last
    node.next = null
    if (queue.last)
      queue.last.next = node
    queue.last = node
    if (!queue.first)
      queue.first = node
  }
}
