'use strict'

//variables
var express = require('express');
var empresaController = require('../controllers/EmpresaController');
var api = express.Router();
var validacion = require('../middlewares/authenticate');
var multiparty = require("connect-multiparty");
var path = multiparty({uploadDir:'./uploads/empresas'});
//rutas
api.post('/registro-empresa', empresaController.registro_empresa);
api.get('/confirmacion/:token', empresaController.confirm);
api.post('/login-empresa', empresaController.login_empresa);
api.put('/actualizar_empresa/:id',[validacion.auth,path],empresaController.actualizar_empresa);
api.get('/obtener_empresa/:id',validacion.auth,empresaController.obtener_empresa);
api.get('/obtener_logo/:img',empresaController.obtener_foto);
api.get('/empleado_datos/:empresaId',validacion.auth, empresaController.obtenerEmpleadosPorEmpresa);
api.get('/usuarios_datos/:empresaId',validacion.auth, empresaController.obtenerUsuariosPorEmpresa);

module.exports = api;