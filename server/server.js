const http = require('http');
const app = require('./app');

const port = process.env.PORT || 80;
const server = http.createServer(app);
console.log(process.env.NODE_ENV);

server.listen(port, () => console.log('Listening on port ' + port));
