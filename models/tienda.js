var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var TiendaSchema = Schema({
    numero_venta: {type:String, require: true},
    fecha: {type:Date, require: true},
    cantidad: {type:Number, require: true},
    productos: [{
        productoId: { type: mongoose.Schema.Types.ObjectId, ref: "producto" },
        cantidad: Number,
        subtotal: Number
      }],
    total: {type:Number, require: true},
    empleadoId: {type: Schema.ObjectId, ref: 'empleado', require: true },
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    usuarioId: {type: Schema.ObjectId, ref: 'usuario', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('tienda',TiendaSchema); 