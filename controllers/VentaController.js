"use strict";
//variables
var Venta = require('../models/venta');
var Empleado = require("../models/empleado");

const registrarVenta = async function(req, res) {
    try {
      if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPLE")) {
        const ventaData = req.body;
        const empleadoId = req.user.id; // ID del empleado
        const empresaId = req.user.sub; // ID de la empresa se encuentra 
  
        // Verificar si ya existe una venta con la misma descripción
        const ventaExistente = await Venta.findOne({ numero_venta: ventaData.numero_venta });
  
        if (ventaExistente) {
          // Si ya existe una venta con la misma descripción, enviar un mensaje de error
          res.status(400).send({ message: "Ya existe una venta registrada con el mismo codigo", data: undefined });
        } else {
          // Si no hay venta con la misma descripción, crear la nueva venta
          const nuevaVenta = new Venta({
            productos: ventaData.productos,
            numero_venta: ventaData.numero_venta,
            cliente: ventaData.cliente,
            total: ventaData.total,
            fecha_venta: ventaData.fecha_venta,
            empleadoId: empleadoId,
            empresaId: empresaId,
          });
  
          await nuevaVenta.save(); // Guarda la venta en la base de datos
          res.status(200).send({ data: nuevaVenta });
        }
      } else {
        res.status(403).send({ message: "Acceso no autorizado" }); // Código de error 403 (Acceso prohibido)
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
  };

  //metodo para listar ventas
  const listar_venta_individual = async function (req, res) {
    if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPLE")) {
        const empresaId = req.user.sub;
        const empleadoId = req.params.empleadoId;
        const cliente = req.query.cliente || null;
        const total = req.query.total || null;

        try {
            let query = {
                empleadoId: empleadoId,
                empresaId: empresaId,
            };

            if (cliente) {
                // Filtro por nombre del cliente si se proporciona
                query.cliente = new RegExp(cliente, "i");
            }

            if (total) {
                // Filtro por total de venta si se proporciona
                query.total = parseFloat(total); // Asegúrate de que el total sea un número
            }

            const ventas = await Venta.find(query);
            res.status(200).send({ data: ventas });
        } catch (error) {
            res.status(500).send({ message: "Error en el servidor", data: undefined });
        }
    } else {
        res.status(403).send({ message: "Acceso no autorizado" });
    }
};

//metodo para obtener id de venta
const obtener_ventas = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE" ) {
      var id = req.params["id"];
      try {
        var reg = await Venta.findById({ _id: id }).populate('empleadoId');
        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(500).send({ message: "No access" });
    }
  } else {
    res.status(500).send({ message: "No access" });
  }
};

//metodo para eliminar usuarios
const eliminar_venta = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN"|| req.user.rol === "EMPRESA"|| req.user.rol === "EMPLE") {
      var id = req.params["id"];

      // Obtener el venta de la base de datos
      const ventas = await Venta.findById(id);

      // Verificar si la venta existe en la base de datos
      if (!ventas) {
        return res.status(404).send({ message: "Venta no encontrado." });
      }

      // Eliminar el venta de la base de datos
      const reg = await Venta.findByIdAndRemove({ _id: id });

      // Enviar la respuesta
      res.status(200).send({ data: reg });
    } else {
      res
        .status(403)
        .send({ message: "No tiene acceso para eliminar la venta." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al eliminar la venta." });
  }
};
  


module.exports = {
    registrarVenta,
    listar_venta_individual,
    obtener_ventas,
    eliminar_venta
}