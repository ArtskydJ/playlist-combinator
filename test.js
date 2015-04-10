var test = require('tape')
var PlaylistCombinator = require('./index.js')

function testInQueue(t, play, check) {
	var fn = check ? play.checkNextSong : play.getNextSong
	return function inQ(n) {
		var id = fn()
		id = id && id.id
		t.equal(n, id, 'correct id, '+n+'==='+id+(check?', check':''))
	}
}

function intoIds(n) {
	return {id: n}
}

test('addUser, getNextSong', function (t) {
	var play = PlaylistCombinator()
	var inQueue = testInQueue(t, play)
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [{id: 0}, {id:2}, {id:4}, {id:5}, {id:6}])
	play.addUser('josh', [{id:1}, {id:3}])

	;[0,1,2,3,4,5,6].forEach(inQueue)
	t.end()
})

test('addUser, checkNextSong', function (t) {
	var play = PlaylistCombinator()
	var inQueue = testInQueue(t, play)
	var nonMutateCheck = testInQueue(t, play, true)
	var twoTest = function (n) {
		nonMutateCheck(n)
		inQueue(n)
	}
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [{id: 0}, {id:2}, {id:4}, {id:5}, {id:6}])
	play.addUser('josh', [{id:1}, {id:3}])

	;[0,1,2,3,4,5,6].forEach(twoTest)
	nonMutateCheck(null)
	t.end()
})

test('addSong', function (t) {
	var play = PlaylistCombinator()
	var inQueue = testInQueue(t, play)
	play.on('error', t.fail.bind(t))
	play.addUser('joseph')
	play.addUser('josh')

	;[0,2,4,5,6].map(intoIds).forEach( play.addSong.bind(null, 'joseph') )
	;[1,3].map(intoIds).forEach( play.addSong.bind(null, 'josh') )
	;[0,1,2,3,4,5,6].forEach(inQueue)

	t.end()
})

test('reorderSong array', function (t) {
	var play = PlaylistCombinator()
	var inQueue = testInQueue(t, play)
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [1,3].map(intoIds))
	play.addUser('josh', [1,3].map(intoIds))

	play.reorderSong('joseph', [0,2,4,5,6].map(intoIds))

	;[0,1,2,3,4,5,6].forEach(inQueue)

	t.end()
})

test('reorderSong id, index', function (t) {
	var play = PlaylistCombinator()
	var inQueue = testInQueue(t, play)
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [4,2,6,0,5].map(intoIds))
	play.addUser('josh', [1,3].map(intoIds))

	play.reorderSong('joseph', 4, 1)
	play.reorderSong('joseph', 0, 0)
	play.reorderSong('joseph', 5, 3)

	;[0,1,2,3,4,5,6].forEach(inQueue)

	t.end()
})

test('removeUser', function (t) {
	var play = PlaylistCombinator()
	var inQueue = testInQueue(t, play)
	var state = []
	play.on('error', t.fail.bind(t))
	play.addUser('joseph', [0,2,0,1,2].map(intoIds))
	play.addUser('josh',   [1,3,4,5,6].map(intoIds))

	var exported = function (n) {
		var id1 = play.getNextSong()
		var id2 = state[n].id
		t.notOk(id1, 'id is falsey')
		t.equal(n, id2, 'correct state')
	}

	;[0,1,2,3].forEach(inQueue)
	state = play.removeUser('joseph')
	;[4,5,6].forEach(inQueue)

	;[0,1,2].forEach(exported)

	t.end()
})
