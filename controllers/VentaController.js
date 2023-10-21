"use strict";
//variables
var Venta = require('../models/venta');
var Empleado = require("../models/empleado");

const registrarVenta = async function(req, res) {
    try {
      if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPLE")) {
        const ventaData = req.body;
        const usuarioId = req.user.id; // ID del empleado
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
            usuarioId: usuarioId,
            nombre_emple: ventaData.nombre_emple,
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
    if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPLE"|| req.user.rol === "EMPRESA")) {
        const empresaId = req.user.sub;
        const usuarioId = req.params.usuarioId;
        const cliente = req.query.cliente || null;
        const total = req.query.total || null;

        try {
            let query = {
                usuarioId: usuarioId,
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

            const ventas = await Venta.find(query).populate('usuarioId');
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
        var reg = await Venta.findById({ _id: id });
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
  
const listar_ventas = async function (req, res) {
  if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPRESA")) {
      const fechaInicio = req.query.fechaInicio || null;
      const fechaFin = req.query.fechaFin || null;

      try {
          let query = {};

          if (fechaInicio && fechaFin) {
              // Filtro por rango de fechas si se proporciona ambas fechas
              query.fecha_venta = {
                  $gte: new Date(fechaInicio + "T00:00:00.000Z"), // Desde las 00:00:00
                  $lte: new Date(fechaFin + "T23:59:59.999Z")  // Hasta las 23:59:59
              };
          } else if (fechaInicio) {
              // Filtro para una fecha específica si solo se proporciona la fecha de inicio
              query.fecha_venta = {
                  $gte: new Date(fechaInicio + "T00:00:00.000Z"),
                  $lte: new Date(fechaInicio + "T23:59:59.999Z")
              };
          }

          const ventas = await Venta.find(query).populate('usuarioId')
          res.status(200).send({ data: ventas });
      } catch (error) {
          res.status(500).send({ message: "Error en el servidor", data: undefined });
      }
  } else {
      res.status(403).send({ message: "Acceso no autorizado" });
  }
};

async function calcularTotalVentas(req, res) {
  try {
      // Verifica si el usuario tiene el rol de "ADMIN" o "EMPRESA"
      if (req.user && (req.user.rol === "ADMIN" || req.user.rol === "EMPRESA")) {
          // Obtiene el ID de usuario de los parámetros de consulta
          const userId = req.query.usuarioId;
          
          // Obtiene el mes y año actuales
          const mesActual = new Date().getMonth(); // Mes en JavaScript es 0-indexed (enero = 0)
          const anioActual = new Date().getFullYear();

          // Realiza una consulta para encontrar todas las ventas del usuario en el mes y año actuales
          const ventasEnMes = await Venta.find({
              fecha_venta: {
                  $gte: new Date(anioActual, mesActual, 1),
                  $lt: new Date(anioActual, mesActual + 1, 1)
              },
              usuarioId: userId
          });

          // Calcula el total de ventas sumando los valores del campo "total" de cada venta
          const totalVentasEnMes = ventasEnMes.reduce((total, venta) => total + venta.total, 0);

          res.status(200).json({ totalVentas: totalVentasEnMes });
      } else {
          // Si el usuario no tiene los permisos necesarios, devuelve un mensaje de error
          res.status(403).json({ error: 'Acceso no autorizado.' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al calcular el total de ventas.' });
  }
}


module.exports = {
    registrarVenta,
    listar_venta_individual,
    obtener_ventas,
    eliminar_venta,
    listar_ventas,
    calcularTotalVentas
}