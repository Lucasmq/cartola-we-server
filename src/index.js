const express = require('express');
const axios = require('axios');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());
app.use(require('./routes'));
app.use('/', express.static(path.resolve(__dirname, 'loaderio')));
app.use('/img', express.static(path.resolve(__dirname, 'img')));
app.use('/audio', express.static(path.resolve(__dirname, 'audio')));

const PORT = process.env.PORT || 3005;

server.listen(PORT, async () => {
    console.log(`on em ${PORT}` );
})