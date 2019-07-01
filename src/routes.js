const express = require('express');
const routes = new express.Router();

const TimeController = require('./controllers/TimeController');

routes.get('/time/:id', TimeController.infoTime);

module.exports = routes;
