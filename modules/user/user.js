// Uncomment the below lines if you need linting
// const {MongoClient} = require('mongodb');
// const express = require('express');
// const client = new MongoClient(process.env.MONGO_URI);
// const db = client.db();
// const app = express()


// In-memory mapping means if we hot-reload, the tokens get destroyed
const user_tokens = new Map();

function passHash(pw){
	return pw; // Realistically we should hash/salt this
}

function makeToken(){
	return Math.floor(Math.random()*1e10+Math.random()*1e5);
}

// client needs to send as headers so it doesnt get mixed with any other data
// we return boolean so caller can return early as .end()ing here causes errors
// if caller keeps modifying request.
function loggedIn(req, res) {
	if (String(user_tokens.get(req.get('username'))) == String(req.get('token'))) return true; // check if logged in
	res.status(401).end(); // UNAUTHORIZED
	return false;
}

app.get('/login',(_,res)=>res.sendFile(__dirname+"/login.html"));
app.get('/register',(_,res)=>res.sendFile(__dirname+"/register.html"));
app.get('/account',(_,res)=>res.sendFile(__dirname+"/account.html"));

// Log them in if possible
app.post('/api/login', async (req,res)=>{
	const users = db.collection('users');
	res.set('Content-Type', 'application/json'); // ct header
	if(await users.find({
		username: req.body.username,
		password: passHash(req.body.password)
	}).hasNext()){
		const token = makeToken();
		user_tokens.set(req.body.username, token); // loggedin
		res.status(200).send({
			token: token,
			username: req.body.username
		});
		return;
	}
	
	res.status(401).end() // UNAUTHORIZED
})

// Register the user
app.post('/api/register', async (req,res)=>{
	const users = db.collection('users');
	res.set('Content-Type', 'application/json'); // ct header
    if (await users.find({username: req.body.username}).hasNext()){
		res.status(400);
        res.send({data: "Username is taken."});
		return;
    }

	await users.insertOne({ // create user
		username: req.body.username,
		password: passHash(req.body.password)
	});

	// same logic as login
	const token = makeToken();
	user_tokens.set(req.body.username, token); // loggedin
	res.status(200).send({
		token: token,
		username: req.body.username
	});
})

app.post('/api/logout', async (req, res)=>{
	res.set('Content-Type', 'application/json'); // ct header
	
	// check if we're actually logged in to logout
	if(user_tokens.get(req.body.username)==req.body.token){
		user_tokens.delete(req.body.username);
		res.status(200).json({url: "/"}); // we expect the user to handle 
		return;
	}
	res.status(401).end(); // UNAUTHORIZED
})

// Example endpoint we can use for sanity check, should kick u out if not logged in
app.get('/api/account', (req,res)=>{
	if(!loggedIn(req, res)) return;
	res.status(200).json({
		username: req.get('username'), // since its a GET route, must get username from headers
	})
})