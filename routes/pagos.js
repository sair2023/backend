'use strict'

//variables
var express = require('express');
var pagoController = require('../controllers/PagoController')
var api = express.Router();
var validacion = require('../middlewares/authenticate');



module.exports = api;
