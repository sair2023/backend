var Compra = require('../models/compra');
var DetalleCompra = require('../models/detallecompra');
var Producto = require('../models/producto');

function registrar(req,res){
    let data = req.body;
    var compra = new Compra();
    compra.idproveedor = data.idproveedor;
    compra.iduser = data.iduser;
    compra.comprobante = data.comprobante;
    compra.num_comprobante = data.num_comprobante;
    compra.save((err,compra_save)=>{
        if(compra_save){
            let detalles = data.detalles;

            detalles.forEach((element,index) => {
                var detallecompra = new DetalleCompra();
                detallecompra.idproducto = element.idproducto;
                detallecompra.cantidad = element.cantidad;
                detallecompra.compra = compra_save._id;

                detallecompra.save((err,detalle_save)=>{
                    if(detalle_save){
                        Producto.findById({_id:element.idproducto},(err,producto_data)=>{
                            if(producto_data){
                                Producto.findByIdAndUpdate({_id:producto_data._id},{stock: parseInt(producto_data.stock) + parseInt(element.cantidad)},(err,producto_edit)=>{
                                    res.end();
                                })
                            }else{
                                res.send(err);
                            }
                        });
                    }else{
                        res.send(err);
                    }
                });

            });

        }else{
            res.send(err);
        }
    });
}

function datos_compra(req,res){
    var id = req.params['id'];

    Compra.findById(id).populate('idproveedor').populate('iduser').exec((err,data_compra)=>{
        if(data_compra){
            DetalleCompra.find({compra:data_compra._id}).populate('idproducto').exec({idcompra:id},(err,data_detalle)=>{
                if(data_detalle){
                    res.status(200).send(
                        {
                            data : {
                                compra: data_compra,
                                detalles: data_detalle
                            }
                        }
                    );
                }
            });
        }
    });
}

function listado_compra(req,res){
    
    Compra.find().populate('idproveedor').populate('iduser').exec((err,data_compras)=>{
        if(data_compras){
            res.status(200).send({compras:data_compras});
        }else{
            res.status(404).send({message: "No hay ningun registro de venta"});
        }
    });
}

function detalles_compra(req,res){
    var id = req.params['id'];

    DetalleCompra.find({compra: id}).populate('idproducto').exec((err,data_detalles)=>{
        if(data_detalles){
            res.status(200).send({detalles:data_detalles});
        }else{
            res.status(404).send({message: "No hay ningun registro de venta"});
        }
    });
}

module.exports = {
    registrar,
    datos_compra,
    listado_compra,
    detalles_compra
}