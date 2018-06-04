const express = require('express');
const path = require('path');
const server = express();
const app = require('./app');
const posts = require('.');

const port = process.env.PORT || 8080;

server.use(express.static(path.resolve(__dirname, '../client/')));
server.use('/api', posts);

server.listen(port, () => console.log('Listening on port 8080'));
