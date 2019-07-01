const express = require('express');
const axios = require('axios');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());
app.use(require('./routes'));

server.listen(3005, async () => {
    console.log("on em localhost:3005");
})