const express = require('express');
const multer = require('multer');
const routes = new express.Router();

const TimeController = require('./controllers/TimeController');
const BuscaTimeController = require('./controllers/BuscaTImeController');

routes.get('/time/:id', TimeController.infoTime);
routes.get('/times', BuscaTimeController.buscaTime);

module.exports = routes;
