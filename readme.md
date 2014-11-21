playlist-combinator
===================


```js
var userOrder = ['me@joshduff.com', 'me@josephdykstra.com']

var songs = {
	"me@joshduff.com": [ { id: 'hash', title: 'whatever' }]
	"me@josephdyskstra.com": [ {id: 'otherhash', title: 'whatever 2' }]
}

module.exports = {
	getNextSong // finds the next user, removes the next song from their queue and returns/removes it.  Moves that user to the back of the user list
	addSong(userId, song)
	reorderSong(userId, [array of song ids in the new order])
	reorderSong(userId, songId, newQueueLocationIndex)
	addUser(userId, userState)
	removeUser(userId) // returns userState
}
```