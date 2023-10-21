var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ProductoSchema = Schema({
    codigo: {type:String, require: true},
    titulo: {type:String, require: true},
    precio: {type: Number , require: true},
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('producto',ProductoSchema); 