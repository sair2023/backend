"use strict";
//variables
var Tienda = require('../models/tienda');
var Producto = require("../models/producto");

const registrarCompra = async function(req, res) {
    try {
        if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPRESA")) {
            const compraData = req.body;
            const usuarioId = req.user.id; // ID del empleado
            const empresaId = req.user.sub; // ID de la empresa se encuentra 

            // Verificar si ya existe una compra con el mismo número de compra
            const compraExistente = await Tienda.findOne({ numero_venta: compraData.numero_venta });

            if (compraExistente) {
                // Si ya existe una compra con el mismo número de compra, enviar un mensaje de error
                res.status(400).send({ message: "Ya existe una compra registrada con el mismo número de compra", data: undefined });
            } else {
                // Crear la nueva compra con los datos recibidos
                const nuevaCompra = new Tienda({
                    fecha: compraData.fecha,
                    numero_venta: compraData.numero_venta,
                    cantidad: compraData.cantidad,
                    total: compraData.total,
                    empleadoId: compraData.empleadoId,
                    producto: compraData.producto,
                    empresaId: empresaId,
                    usuarioId: usuarioId
                });

                await nuevaCompra.save(); // Guarda la compra en la base de datos
                res.status(200).send({ data: nuevaCompra });
            }
        } else {
            res.status(403).send({ message: "Acceso no autorizado" }); // Código de error 403 (Acceso prohibido)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
};



module.exports = {
    registrarCompra
}