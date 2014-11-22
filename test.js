var test = require('tap').test
var Playlist = require('./index.js')

test('addUser, getNextSong', function (t) {
	var play = Playlist()
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [{id: 0}, {id:2}, {id:4}, {id:5}, {id:6}])
	play.addUser('josh', [{id:1}, {id:3}])

	for(var i = 0; i < 7; i++) {
		var id = play.getNextSong().id
		t.equal(i, id, 'correct id, '+i+'==='+id)
	}
	t.end()
})

test('addSong', function (t) {
	var play = Playlist()
	play.on('error', t.fail.bind(t))
	play.addUser('joseph')
	;[ {id: 0}, {id:2}, {id:4}, {id:5}, {id:6} ]
		.forEach( play.addSong.bind(null, 'joseph') )
	;[ {id:1}, {id:3} ]
		.forEach( play.addUser.bind(null, 'josh') )

	for(var i = 0; i < 7; i++) {
		var id = play.getNextSong().id
		t.equal(i, id, 'correct id, '+i+'==='+id)
	}
	t.end()
})

test('reorderSong array', function (t) {
	var play = Playlist()
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [{id:1}, {id:3}])
	play.addUser('josh', [{id:1}, {id:3}])

	play.reorderSong('joseph', [{id: 0}, {id:2}, {id:4}, {id:5}, {id:6}])

	for(var i = 0; i < 7; i++) {
		var id = play.getNextSong().id
		t.equal(i, id, 'correct id, '+i+'==='+id)
	}
	t.end()
})

test('reorderSong id, index', function (t) {
	var play = Playlist()
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [{id: 4}, {id:2}, {id:6}, {id:0}, {id:5}])
	play.addUser('josh', [{id:1}, {id:3}])

	play.reorderSong('joseph', 4, 1)
	play.reorderSong('joseph', 0, 0)
	play.reorderSong('joseph', 5, 3)

	for(var i = 0; i < 7; i++) {
		var id = play.getNextSong().id
		t.equal(i, id, 'correct id, '+i+'==='+id)
	}
	t.end()
})

test('removeUser', function (t) {
	var play = Playlist()
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [{id: 0}, {id:2}, {id:5}, {id:6}])
	play.addUser('josh', [{id:0}, {id:1}, {id:3}, {id:4} ])

	var josephState = null
	for(var i = 0; i < 7; i++) {
		if (i===4) {
			josephState = play.removeUser('joseph')
		}

		var id = play.getNextSong().id
		if (i <= 3) {
			t.equal(i, id, 'correct id, '+i+'==='+id)
		} else {
			t.type(id, 'undefined', 'id is undefined')
			t.equal(i, josephState[i-4], 'correct state')
		}
	}
	t.end()
})

/*
removeUser(userId) // returns userState
*/
