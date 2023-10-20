'use strict'

//variables
var express = require('express');
var empleadoController = require('../controllers/EmpleadoController');
var api = express.Router();
var validacion = require('../middlewares/authenticate');
var multiparty = require("connect-multiparty");
var path = multiparty({uploadDir:'./uploads/empleados'});

api.post('/registro_empleado',[validacion.auth,path],empleadoController.registro_empleado);
api.get('/listar_empleados/:tipo/:filtro?',validacion.auth,empleadoController.listar_empleado);
api.get('/obtener_foto/:img',empleadoController.obtener_foto);
api.delete('/eliminar_empleado/:id',validacion.auth,empleadoController.eliminar_empleado);
api.get('/obtener_empleado/:id',validacion.auth,empleadoController.obtener_empleado);
api.put('/actualizar_empleado/:id',[validacion.auth,path],empleadoController.actualizar_empleado);
api.post('/desactivar_empleado/:id',validacion.auth,empleadoController.desabilitar_Empleado);
api.post('/activar_empleado/:id',validacion.auth,empleadoController.activar_Empleado);
api.get('/obtener_empleados/:id',validacion.auth,empleadoController.obtener_empleados);

module.exports = api;