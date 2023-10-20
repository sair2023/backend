var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartamentoSchema = Schema({
    titulo: String,
    empresaId: {type: Schema.ObjectId, ref: 'empresa', require: true },
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('departamento',DepartamentoSchema);