"use strict";

//variables
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
  correo: { type: String, require: true, lowercase: true, unique: true },
  password: { type: String, require: true },
  rol: { type: String, require: true },
  status:{ type: String,require: true, default: 'INACTIVO' },
  empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
  empleadoId: {type: Schema.ObjectId, ref: 'empleado',require: true},
  createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model("usuario", UsuarioSchema);
