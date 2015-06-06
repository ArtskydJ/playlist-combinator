var EventEmitter = require('events').EventEmitter
require('array.prototype.find')


module.exports = function closure() {
	var emitter = new EventEmitter()
	var emitErr = emitter.emit.bind(emitter, 'error')

	var queueKeys = [] //users
	var queues = {} //users' queues

	function getNextItem() {
		if (checkNextItem.apply(null, arguments)) {
			var key = queueKeys.shift()
			queueKeys.push(key)
			return (queues[key].length ?
				queues[key].shift() :
				getNextItem.apply(null, arguments)
			)
		} else {
			return null
		}
	}

	function checkNextItem() {
		var key
		if (queueKeys.length) {
			key = queueKeys.find(function (key) {
				return queues[key] && queues[key].length
			})
		}
		return key ? queues[key][0] : null
	}

	function addItem(queueKey, newItem) {
		if (queues[queueKey] && queues[queueKey].push && newItem) {
			queues[queueKey].push(newItem)
		} else if (!newItem) {
			emitErr(new TypeError('Invalid newItem: ' + queueKey))
		} else {
			emitErr(new TypeError('Invalid queueKey: ' + queueKey))
		}
	}

	function reorder(queueKey, thing1, thing2) {
		function reorderQueue(newQueue) {
			queues[queueKey] = newQueue
		}

		function reorderItem(itemId, newIndex) {
			var queue = queues[queueKey]
			var oldIndex = queue.reduce(function (memo, item, index) {
				return (itemId === item.id)? index : memo
			}, null)

			if (typeof oldIndex === 'number' && typeof newIndex === 'number') {
				var cutItem = queue.splice(oldIndex, 1)[0] //cut
				queue.splice(newIndex, 0, cutItem)   //paste
			}
			return queue
		}

		if (Array.isArray(thing1)) {
			reorderQueue(thing1)
		} else if (typeof thing2 === 'number') {
			var newQueue = reorderItem(thing1, thing2)
			reorderQueue(newQueue)
		} else {
			var args = [].join.call(arguments, ', ')
			emitErr(new TypeError('Invalid arguments passed to reorder: ' + args))
		}
	}

	function addKey(queueKey, state) {
		if (typeof queueKey === 'string') {
			var notInQueueKeys = queueKeys.indexOf(queueKey) === -1
			var notAQueue = !queues[queueKey]
			if (notInQueueKeys && notAQueue) {
				queueKeys.push(queueKey)
				queues[queueKey] = state || []
			} else {
				emitErr(new Error('Attempting to add a duplicate user.'))
			}
		} else if (typeof queueKey === 'string'){
			emitErr(new TypeError('queueKey should be a string, but is a ' + typeof queueKey))
		}
	}

	function removeKey(queueKey) {
		if (typeof queueKey === 'string') {
			queueKeys.splice(queueKeys.indexOf(queueKey), 1) //cut from array
			var state = queues[queueKey]
			delete queues[queueKey]
			return state
		} else {
			emitErr(new TypeError('queueKey should be a string, but is a ' + typeof queueKey))
			return null
		}
	}

	emitter.getNextSong = getNextItem // () -> item
	emitter.checkNextSong = checkNextItem
	emitter.addSong = addItem         // (userId, song)
	emitter.reorderSong = reorder     // (userId, [newly ordered array]) OR (userId, songId, newIndex)
	emitter.addUser = addKey          // (userId, userState)
	emitter.removeUser = removeKey    // (userId) -> userState

	return emitter
}
