'use strict'

//variables
var express = require('express');
var produccionController = require('../controllers/ProduccionController')
var api = express.Router();
var validacion = require('../middlewares/authenticate');



module.exports = api;
