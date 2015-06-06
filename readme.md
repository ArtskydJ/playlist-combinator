playlist-combinator
===================

[![Build Status](https://travis-ci.org/ArtskydJ/playlist-combinator.svg)](https://travis-ci.org/ArtskydJ/playlist-combinator)
[![Dependency Status](https://david-dm.org/ArtskydJ/playlist-combinator.svg)](https://david-dm.org/ArtskydJ/playlist-combinator)
[![devDependency Status](https://david-dm.org/ArtskydJ/playlist-combinator/dev-status.svg)](https://david-dm.org/ArtskydJ/playlist-combinator#info=devDependencies)

A javascript module to rotate through multiple users' music queues.

# usage

Run this code:
```js
var playlist = require('playlist-combinator')()
playlist.on('error', function (err) {
	console.log(err)
})

playlist.addUser('Wheatley', [ 'accent' ])
playlist.addUser('GLaDOS')

playlist.addSong('GLaDOS', 'potato')
playlist.addSong('GLaDOS', 'neurotoxin')
playlist.addSong('GLaDOS', 'Caroline')
```

Internally:
```js
userOrder: ['GLaDOS', 'Wheatley']
songs: {
	"Wheatley": [ 'accent' ],
	"GLaDOS": [ 'potato', 'neurotoxin', 'Caroline' ]
}
```

Run this code:
```js
var song = playlist.getNextSong() //returns => 'potato'
```

Internally:
```js
userOrder: ['Wheatley', 'GLaDOS'] //note that GLaDOS was moved to the back; and it's Wheatley's turn next
songs: {
	"Wheatley": [ 'accent' ]
	"GLaDOS": [ 'neurotoxin', 'Caroline' ]
}
```

Run this code:
```js
var song = playlist.getNextSong() //returns => 'accent'
var song = playlist.getNextSong() //returns => 'neurotoxin'
var song = playlist.getNextSong() //returns => 'Caroline'
```


# api

```js
var PlaylistCombinator = require('playlist-combinator')
```

## `var playlist = PlaylistCombinator()`

### `var song = playlist.getNextSong()`

- Removes the first song from the first user's queue.
- Moves the first user to the back of the user list.
- **Returns** the `song` object.

### `var song = playlist.checkNextSong()`

Basically `playlist.getNextSong()` but this does not mutate the playlist.

- **Returns** the first song from the first user's queue.

### `playlist.addSong(userId, song)`

- `userId` is a string. Each user must have their own unique string. The `userId` must have been added via `playlist.addUser(userId)` previous to calling this.
- `song` is any object.

### `playlist.reorderSong(userId, newArray)`

This is the suggested way to reorder songs. This is not the suggested way to add or remove songs, although it is completely allowed.

- `userId` is a string. Each user must have their own unique string. The `userId` must have been added via `playlist.addUser(userId)` previous to calling this.
- `newArray` is an array of song ids in the new order. You can remove songs, add songs, and reorder songs.

### `playlist.reorderSong(userId, songId, newQueueLocationIndex)`

This is not the suggested way to reorder songs.

- `userId` is a string. Each user must have their own unique string. The `userId` must have been added via `playlist.addUser(userId)` previous to calling this.
- `songId` is compared to each `song.id` in the queue. This is the only place that `song.id` is assumed to exist.
- `newQueueLocationIndex` is the number that the located song is relocated to.

### `playlist.addUser(userId, userState)`

- `userId` is a string. Each user must have their own unique string. The `userId` must have been added via `playlist.addUser(userId)` previous to calling this.
- `userState` is an optional argument. It must come from `playlist.removeUser()`.

### `var userState = playlist.removeUser(userId)`

- **Returns** a `userState` object. This object can be passed into `playlist.addUser()` to start a new user with the same state that this user gave up. This could be used for changing a `userId` without losing their state, or saving a user's state for later use.

# license

[VOL](http://veryopenlicense.com)
