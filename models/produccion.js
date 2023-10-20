'use strict'

//variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProduccionSchema = Schema({
    cantidad: {type: Number, require: true},
    descripcion: {type: String, require: true},
    total: {type: Number, require: true},
    fecha_entrega: {type: Date, require: true},
    empleadoId: {type: Schema.ObjectId, ref: 'empleado', require: true },
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('produccion',ProduccionSchema);