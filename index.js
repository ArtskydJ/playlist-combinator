var EventEmitter = require('events').EventEmitter
require('array.prototype.find')

function getNextItem(emitErr, queues, queueKeys) { //emitter, queues, and queueKeys are bound
	if (checkNextItem.apply(null, arguments)) {
		var key = queueKeys.shift()
		queueKeys.push(key)
		return (queues[key].length ?
			queues[key].shift() :
			getNextItem.apply(null, arguments)
		)
	}
	return null
}

function checkNextItem(emitErr, queues, queueKeys) { //emitter, queues, and queueKeys are bound
	if (queueKeys.length) {
		var key = queueKeys.find(function (key) {
			return queues[key] && queues[key].length
		})
	}
	return key ? queues[key][0] : null
}

function addItem(emitErr, queues, queueKey, newItem) { //emitter and queues are bound
	if (queues[queueKey] && queues[queueKey].push && newItem) {
		queues[queueKey].push(newItem)
	} else if (!newItem) {
		emitErr(new TypeError('Invalid newItem: ' + queueKey))
	} else {
		emitErr(new TypeError('Invalid queueKey: ' + queueKey))
	}
}

function reorder(emitErr, queues, queueKey, thing1, thing2) { //emitter and queues are bound
	function reorderQueue(newQueue) {
		if (Array.isArray(newQueue)) {
			queues[queueKey] = newQueue
		} else {
			emitErr(new TypeError('newQueue must be an array'))
		}
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

	if (typeof thing1 === 'object') {
		reorderQueue(thing1)
	} else if (typeof thing2 === 'number') {
		var newQueue = reorderItem(thing1, thing2)
		reorderQueue(newQueue)
	} else {
		var args = [].slice.call(arguments, 2).join(', ')
		emitErr(new TypeError('Invalid arguments passed to reorder( ' + args + ' )'))
	}
}

function addKey(emitErr, queues, queueKeys, queueKey, state) { //emitter, queues, and queueKeys are bound
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

function removeKey(emitErr, queues, queueKeys, queueKey) { //emitter, queues, and queueKeys are bound
	if (typeof queueKey === 'string') {
		queueKeys.splice(queueKeys.indexOf(queueKey), 1) //cut from array
		var state = queues[queueKey]
		delete queues[queueKey] //OR queues[queueKey] = null
		return state
	} else {
		emitErr(new TypeError('queueKey should be a string, but is a ' + typeof queueKey))
		return null
	}
}

module.exports = function closure() {
	var emitter = new EventEmitter
	var emitErr = emitter.emit.bind(null, 'error')

	var queueKeys = [] //users
	var queues = {} //users' queues

	emitter.getNextSong =     getNextItem.bind(null, emitErr, queues, queueKeys) // () -> item
	emitter.checkNextSong = checkNextItem.bind(null, emitErr, queues, queueKeys)
	emitter.addSong =             addItem.bind(null, emitErr, queues)            // (userId, song)
	emitter.reorderSong =         reorder.bind(null, emitErr, queues)            // (userId, [newly ordered array]) OR (userId, songId, newIndex)
	emitter.addUser =              addKey.bind(null, emitErr, queues, queueKeys) // (userId, userState)
	emitter.removeUser =        removeKey.bind(null, emitErr, queues, queueKeys) // (userId) -> userState

	return emitter
}
