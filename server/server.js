import express from 'express';
import path from 'path';
const server = express();

const port = process.env.PORT || 8080;

server.use(express.static(path.resolve(__dirname, '../client/')));

server.listen(port, () => console.log('Listening on port 8080'));
