var express = require('express');
var ventaController = require('../controllers/VentaController');
var validacion = require('../middlewares/authenticate');
var api = express.Router();

api.post('/venta_empleado',validacion.auth, ventaController.registrarVenta);
api.get('/ventas_empleado/:empleadoId', validacion.auth, ventaController.listar_venta_individual);
api.get('/obtener_venta/:id',validacion.auth,ventaController.obtener_ventas);
api.delete('/eliminar_venta/:id',validacion.auth,ventaController.eliminar_venta);

module.exports = api;