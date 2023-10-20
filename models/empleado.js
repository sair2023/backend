'use strict'

//variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpleadoSchema = Schema({
    nombre: {type: String, require: true},
    apellido: {type: String, require: true},
    telefono: {type: Number, require: true},
    slug: {type: String, required: true},
    nit: {type: String, require: true},
    dpi: {type: String, require: true},
    civil: {type: Boolean, require: true},
    tiene_hijos: {type: Boolean, require: true},
    pareja: {type: String, default: 'No tiene'},
    num_hijos: {type: Number, default: 0},
    nom_hijos: {type: String, default: 'No tiene'},
    direccion: {type: String, require: true},
    foto: {type: String, require: true},
    fecha_contra: {type: Date, require: true},
    salario_base: { type: Number, require: true},
    status: {type: String, require: true, default: 'ACTIVO'},
    deparId: {type: Schema.ObjectId, ref: 'departamento'},
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});


module.exports = mongoose.model('empleado', EmpleadoSchema);