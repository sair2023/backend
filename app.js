'use strict'
//variables del sistema

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;
const cors = require('cors');
//Variable para rutas
var usuario_route = require('./routes/usuario');
var empresta_route = require('./routes/empresa');
var empleado_route = require('./routes/empleado');
var depa_route = require('./routes/departamento');
var marca_route = require('./routes/marca');
var producto_route = require('./routes/producto');
var venta_route = require('./routes/venta');
var expediente_route = require('./routes/expediente');
var produccion_route = require('./routes/produccion');
var pago_route = require('./routes/pagos');

//conexion a base de datos
const databese = module.exports = () =>{
    try {
        mongoose.connect('mongodb+srv://administrador:0E2dbzNUdK5zFeHs@cluster0.kzubisb.mongodb.net/?retryWrites=true&w=majority');
        console.log('Base datos conectada');
    } catch (error) {
        console.log(error);
        console.log('Base datos no conectada');
    }
}

//permite la conexion entre back y front
// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*'); 
//     res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
//     res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
//     next();
// });
app.use(cors());

app.listen(port, () =>{
    console.log('server corriendo en el puerto '+ port);
});

//metodo para parsear data de fronted a backend
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit: '50mb' ,extended:true}));


app.use('/api',usuario_route);
app.use('/api',empresta_route);
app.use('/api',empleado_route);
app.use('/api',marca_route);
app.use('/api',producto_route );
app.use('/api',venta_route );
app.use('/api',depa_route );
app.use('/api', expediente_route);
app.use('/api', pago_route);
app.use('/api', produccion_route);


databese();

module.exports = app;