'use strict'

//variables
var express = require('express');
var api = express.Router();
var validacion = require('../middlewares/authenticate');
var tiendaController = require('../controllers/TiendaController')

api.post('/registro_compra',validacion.auth,tiendaController.registrarCompra);


module.exports = api;