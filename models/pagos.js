'use strict'

//variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PagosSchema = Schema({
    horas_extras: {type: Number, require: true},
    comision: {type: Number, require: true},
    bonificacion: {type: Number, require: true},
    fecha_pago: {type: Date, require: true},
    status: {type: String, require: true},
    deparId: {type: Schema.ObjectId, ref: 'departamento',require: true},
    ventaId: {type: Schema.ObjectId, ref: 'venta',require: true},
    empleadoId: {type: Schema.ObjectId, ref: 'empleado', require: true },
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});


module.exports = mongoose.model('pago', PagosSchema);


