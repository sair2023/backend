'use strict'

//variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    nombre: {type: String, require: true, unique:true},
    direccion: {type: String, require: true},
    correo: {type: String, require: true, lowercase:true, unique:true},
    password: {type: String, require: true},
    codigo: {type: String, require: true, unique:true},
    logo: {type: String, default: 'logo.png', require: true}, 
    telefono: {type: Number, require: true, lowercase:true, unique:true},
    nit: {type: String, require: true, lowercase:true, unique:true},
    status: { type: String, require: true, default: 'SIN-VERIFICAR'},
    rol: {type: String, require: true, default:'EMPRESA' },
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('empresa', EmpresaSchema);