var express = require('express');
var marcaController = require('../controllers/MarcaController');

var api = express.Router();

api.post('/marca/registrar',marcaController.registrar);
api.get('/marca/:id',marcaController.obtener_marca);
api.put('/marca/editar/:id',marcaController.editar);
api.delete('/marca/eliminar/:id',marcaController.eliminar);
api.get('/marca/:nombre?',marcaController.listar);

module.exports = api;