'use strict'

//variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    cantidad: {type: Number, require: true},
    descripcion: {type: String, require: true},
    precioUnitario: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

var VentaSchema = Schema({
    productos: [ProductoSchema],
    numero_venta: {type: String, require: true},
    cliente: {type: String, require: true},
    total: {type: Number, require: true},
    fecha_venta: {type: Date, require: true},
    nombre_emple:{type: String, require: true},
    usuarioId: {type: Schema.ObjectId, ref: 'usuario', require: true },
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('venta',VentaSchema);