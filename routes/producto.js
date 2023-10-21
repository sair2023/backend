var express = require('express');
var productoController = require('../controllers/ProductoController');
var validacion = require('../middlewares/authenticate');
var api = express.Router();

api.post('/registro_producto',validacion.auth,productoController.registro_producto);
api.get('/listar_producto',validacion.auth,productoController.listar_productos);
api.delete('/eliminar_producto/:id',validacion.auth,productoController.eliminar_productos);
api.get('/obtener_producto/:id',validacion.auth,productoController.obtener_producto);


module.exports = api;