var express = require('express');
var router = express.Router();

// users
var userlist = [ {
	name : 'peter',
	messages : [ "Peters Nachrichten" ]
}, {
	name : 'paul',
	messages : [ "Pauls Nachrichten" ]
}, {
	name : 'mary',
	messages : [ "Marys Nachrichten" ]
} ];

function users(req, res) {
	res.render("users", {
		users : userlist,
		title : "Liste von Nutzern"
	});
}

//GET users list page
router.get('/', users);

// find user
function getUser(req, res, next) {
	var name = req.params.name;
	for (var i = 0; i < userlist.length; i++) {
		if (userlist[i].name === name) {
			req.user = userlist[i];
			next();
			return;
		}
	}
	throw new Error("Sorry, dieser Nutzer existiert leider nicht!");
}

// render user messages page
function user(req, res, next) {
	res.render("messages", {
		user : req.user,
		title : "Messages"
	});
}

//GET user messages page
router.get('/messages/:name', getUser, user);


function pushMessage(req, res, next) {
	var message = req.body.message;
	var user = req.user;
	user.messages.push(message);
	next();
}

//POST user message page
router.post('/messages/:name', getUser, pushMessage, user);

module.exports = router;
