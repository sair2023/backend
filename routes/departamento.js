'use strict'

//variables
var express = require('express');
var departamentoController = require('../controllers/DepartamentoController')
var api = express.Router();
var validacion = require('../middlewares/authenticate');

api.post('/registro-depa',validacion.auth,departamentoController.registro_departamento);
api.get('/listar_depa',validacion.auth,departamentoController.listar_departamento);
api.delete('/eliminar_depa/:id',validacion.auth,departamentoController.eliminar_departamento);
module.exports = api;