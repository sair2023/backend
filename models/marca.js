var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarcaSchema = Schema({
    titulo: String,

});

module.exports = mongoose.model('marca',MarcaSchema);