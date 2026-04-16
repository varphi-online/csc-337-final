const http = require('http');
const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

client.connect().then(() => {
console.log('Connected to MongoDB');
})
.catch((error) => {
console.error('Connection failed', error);
});

http.createServer((req, res)=>{
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(`<DOCTYPE html><html><head></head><body>hi</body></html>`);
}).listen(8080);
