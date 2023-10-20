'use strict'
//variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExpedienteSchema = Schema({
    penales: {type: String, require: true},
    policiacos: {type: String, require: true},
    dpi: {type: String, require: true},
    fecha_creacion: {type: Date, require: true},
    empleadoId: {type: Schema.ObjectId, ref: 'empleado'},
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});


module.exports = mongoose.model('expediente', ExpedienteSchema);