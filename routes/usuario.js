'use strict'

//variables
var express = require('express');
var usuarioController = require('../controllers/UserController');
var api = express.Router();
var validacion = require('../middlewares/authenticate');

api.post('/registro-usuario',validacion.auth,usuarioController.registro_usuario);
api.post('/login-usuario',usuarioController.login_usuario);
api.get('/listar_usuario/:tipo/:filtro?',validacion.auth,usuarioController.listar_usuario);
api.delete('/eliminar_usuario/:id',validacion.auth,usuarioController.eliminar_usuario);
api.post('/desabilitar_usuarios/:ids',validacion.auth,usuarioController.deshabilitar_usuarios);
api.post('/activar_usuarios/:id',validacion.auth,usuarioController.activar_usuario);
api.post('/habilitar_usuarios/:ids',validacion.auth,usuarioController.habilitar_usuarios);
api.put('/editar_usuario/:id',validacion.auth,usuarioController.actualizar_usuario);
api.get('/obtener_usuario/:id',validacion.auth,usuarioController.obtener_usuario);
api.get('/obtener_usuarios/:id',validacion.auth,usuarioController.obtener_usuario2);

module.exports = api;