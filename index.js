const {MongoClient} = require('mongodb');
const express = require('express');
const client = new MongoClient(process.env.MONGO_URI);

// TODO: Remove these when moving module code to files, just for linting
client.connect().then(() => {
	console.log('Connected to MongoDB');
	global.db = client.db(); 
	global.app = express();

	// Middleware has to be applied before any routes defined
	app.use(express.json()); // json parsing
	app.use(express.urlencoded()); // GET and POST args

	// import modules now that we've set globals and middleware
	require('./modules/user/user');
	require('./modules/post/post');
	require('./modules/feeds/feeds');

	app.get('/layout.js', (_,res)=>res.sendFile(__dirname + "/modules/static/layout.js"));
	app.get('/util.js', (_,res)=>res.sendFile(__dirname + "/modules/static/util.js"));
	app.get('/app.css', (_,res)=>res.sendFile(__dirname + "/modules/static/app.css"));
	app.get('/',(_,res)=> //FIXME: this
		res.send(`<!DOCTYPE html>
			<html>
			<head>
			    <title>Fake Home</title>
			    <script defer src="/layout.js"></script>
			    <link rel="stylesheet" href="app.css">
			</head>
			<body>This isnt real</body></html>`
		))

	app.listen(8080)
}).catch((error) => {
	console.error('Connection failed', error);
	process.exit(-1);
});