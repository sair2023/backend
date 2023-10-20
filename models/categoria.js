var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    titulo: String,
});

module.exports = mongoose.model('categoria',CategoriaSchema);