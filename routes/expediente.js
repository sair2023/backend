'use strict'

//variables
var express = require('express');
var expedienteController = require('../controllers/ExpedienteController');
var api = express.Router();
var validacion = require('../middlewares/authenticate');
var multiparty = require("connect-multiparty");
var path = multiparty({uploadDir:'./uploads/expedientes'});

api.post('/registro_expediente',[validacion.auth,path],expedienteController.registro_expediente);
api.get('/obtener_pdf/:pdf',expedienteController.obtener_pdf);
api.get('/listar_expediente/:empleadoId',validacion.auth,expedienteController.listar_expediente);
api.put('/editar_expediente/:id',[validacion.auth,path],expedienteController.editar_expediente);
api.get('/obtener_expediente/:id',validacion.auth,expedienteController.expediente_empleado);

module.exports = api;