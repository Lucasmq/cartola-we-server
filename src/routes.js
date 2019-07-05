const express = require('express');
const multer = require('multer');
const routes = new express.Router();

const TimeController = require('./controllers/TimeController');

routes.get('/time/:id', TimeController.infoTime);

module.exports = routes;
