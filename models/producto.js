var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ProductoSchema = Schema({
    titulo: String,
    descripcion: String,
    presentacion: String,
    imagen: String,
    precio_compra: Number,
    precio_venta: Number,
    stock: Number,
    fecha_vencimiento: String,
    idcategoria: {type: Schema.ObjectId, ref: 'categoria'},
    idmarca: {type: Schema.ObjectId, ref: 'marca'},
});

module.exports = mongoose.model('producto',ProductoSchema);