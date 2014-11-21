playlist-combinator
===================

Run this code:
```js
var playlist = require('playlist-combinator')()
playlist.on('error', function (err) {
	console.log(err)
})

playlist.addUser('josh@example.com', [ { id: 'hash', title: 'whatever' } ])
playlist.addUser('joseph@example.com')

playlist.addSong('joseph@example.com', { id: 'otherhash, title: 'whatever 2' })
playlist.addSong('joseph@example.com', { id: 'somemoreid', title: 'o, hi' })
playlist.addSong('joseph@example.com', { id: 'someid', title: 'thingy' })
```

Internally:
```js
userOrder: ['joseph@example.com', 'josh@example.com']
songs: {
	"josh@example.com": [
		{ id: 'hash', title: 'whatever' }
	]
	"joseph@example.com": [
		{ id: 'otherhash', title: 'whatever 2' },
		{ id: 'somemoreid', title: 'o, hi' },
		{ id: 'someid', title: 'thingy' }
	]
}
```

Run this code:
```js
var song = playlist.getNextSong() //returns => { id: 'otherhash', title: 'whatever 2' }
```

Internally:
```js
userOrder: ['josh@example.com', 'joseph@example.com'] //note that 'joseph' was moved to the back; it's 'josh's turn next
songs: {
	"josh@example.com": [
		{ id: 'hash', title: 'whatever' }
	]
	"joseph@example.com": [
		{ id: 'somemoreid', title: 'o, hi' },
		{ id: 'someid', title: 'thingy' }
	]
}
```
#api

```js
module.exports = {
	getNextSong // finds the next user, removes the next song from their queue and returns/removes it.  Moves that user to the back of the user list
	addSong(userId, song)
	reorderSong(userId, [array of song ids in the new order])
	reorderSong(userId, songId, newQueueLocationIndex)
	addUser(userId, userState)
	removeUser(userId) // returns userState
}
```