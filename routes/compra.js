var express = require('express');
var compraController = require('../controllers/CompraController');

var api = express.Router();

api.post('/compra/registrar',compraController.registrar);
api.get('/compra/:id',compraController.datos_compra);
api.get('/compras',compraController.listado_compra);
api.get('/compra/data/:id',compraController.detalles_compra);

module.exports = api;