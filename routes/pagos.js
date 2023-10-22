'use strict'

//variables
var express = require('express');
var pagoController = require('../controllers/PagoController')
var api = express.Router();
var validacion = require('../middlewares/authenticate');

api.get('/generar_nomina_mensual', pagoController.generarNominaMensual);


module.exports = api;
