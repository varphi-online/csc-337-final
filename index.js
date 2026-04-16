const http = require('http');

console.log("mongo url: "+process.env.MONGO_URL);

http.createServer((req, res)=>{
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(`<DOCTYPE html><html><head></head><body>hi</body></html>`);
}).listen(8080);
