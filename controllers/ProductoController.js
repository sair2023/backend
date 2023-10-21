"use strict";

//variables
var Producto = require("../models/producto");

const registro_producto = async function (req, res) {
    try {
      if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
        const data = req.body;
        const empresaId = req.user.sub;

        console.log(req.user.sub);     
        // Verificar si ya existe un producto con el mismo título
        const productpExistente = await Producto.findOne({ codigo: data.codigo });
        
        if (productpExistente) {
          // Si ya existe un departamento con el mismo nombre, enviar un mensaje de error
          res.status(400).send({ message: "Ya existe un Producto registrado con el mismo nombre.", data: undefined });
        } else {
          // Si no hay producto con el mismo codigo, crear el nuevo producto
          const nuevoProd = new Producto(data); // Crea un nuevo objeto de producto
          nuevoProd.empresaId = empresaId; // Asigna empresaId manualmente
          await nuevoProd.save(); // Guarda el departamento en la base de datos
          res.status(200).send({ data: nuevoProd });
        }
      } else {
        res.status(403).send({ message: "Sin acceso" }); // Código de error 403 (Acceso prohibido)
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
};

const listar_productos = async function(req, res){
    try {
      if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
        const empresaId = req.user.sub;
  
        // Consulta los producto donde la empresaId coincide con la ID de la empresa del usuario
        const productos = await Producto.find({ empresaId: empresaId });
  
        res.status(200).json(productos);
      } else {
        res.status(403).send({ message: "Acceso no autorizado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener la lista de productos' });
    }
  }


//metodo paraeliminar departamento
const eliminar_productos= async function(req, res) {
    if (req.user && req.user.rol === 'ADMIN' || req.user.rol === "EMPRESA") {
      var id = req.params['id'];
  
      try {
        // Verificar si el producto está siendo referenciado en la colección de Empleado
        const productos = await Producto.findOne({ deparId: id });
  
        if (productos) {
          res.status(400).send({ message: 'El departamento está siendo utilizado en la colección de tienda. No se puede eliminar.' });
        } else {
          // Si el producto no está siendo utilizado, eliminarlo
          let reg = await Producto.findByIdAndRemove({ _id: id });
  
          if (reg) {
            res.status(200).send({ data: reg });
          } else {
            res.status(404).send({ message: 'Producto no encontrado.' });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al eliminar el producto.' });
      }
    } else {
      res.status(403).send({ message: 'No tiene acceso para eliminar el producto.' });
    }
  };
  
  //obtener producto
  const obtener_producto = async function (req, res) {
    if (req.user) {
      if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE") {
        var id = req.params["id"];
        try {
          var reg = await Producto.findById({ _id: id });
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


module.exports ={
    registro_producto,
    listar_productos,
    eliminar_productos,
    obtener_producto
}