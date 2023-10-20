"use strict";

//variables
var Departamento = require("../models/departamento");
var Empleado = require('../models/empleado');
//registro de empleado
const registro_departamento = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
      const data = req.body;
      const empresaId = req.user.sub;
      console.log(req.user.sub);
      
      // Verificar si ya existe un departamento con el mismo título
      const depaExistente = await Departamento.findOne({ titulo: data.titulo });
      
      if (depaExistente) {
        // Si ya existe un departamento con el mismo nombre, enviar un mensaje de error
        res.status(400).send({ message: "Ya existe un departamento registrado con el mismo nombre.", data: undefined });
      } else {
        // Si no hay departamento con el mismo título, crear el nuevo departamento
        const nuevoDepa = new Departamento(data); // Crea un nuevo objeto de departamento
        nuevoDepa.empresaId = empresaId; // Asigna empresaId manualmente
        await nuevoDepa.save(); // Guarda el departamento en la base de datos
        res.status(200).send({ data: nuevoDepa });
      }
    } else {
      res.status(403).send({ message: "Sin acceso" }); // Código de error 403 (Acceso prohibido)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error interno del servidor", error: error.message });
  }
  
  };

  //metodo para listar la coleccion de departamento

  const listar_departamento = async function(req, res){
    try {
      if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
        const empresaId = req.user.sub;
  
        // Consulta los departamentos donde la empresaId coincide con la ID de la empresa del usuario
        const departamentos = await Departamento.find({ empresaId: empresaId });
  
        res.status(200).json(departamentos);
      } else {
        res.status(403).send({ message: "Acceso no autorizado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener la lista de departamentos' });
    }
  }

//metodo paraeliminar departamento
const eliminar_departamento = async function(req, res) {
  if (req.user && req.user.rol === 'ADMIN' || req.user.rol === "EMPRESA") {
    var id = req.params['id'];

    try {
      // Verificar si el departamento está siendo referenciado en la colección de Empleado
      const empleadoConDepartamento = await Empleado.findOne({ deparId: id });

      if (empleadoConDepartamento) {
        res.status(400).send({ message: 'El departamento está siendo utilizado en la colección de Empleados. No se puede eliminar.' });
      } else {
        // Si el departamento no está siendo utilizado, eliminarlo
        let reg = await Departamento.findByIdAndRemove({ _id: id });

        if (reg) {
          res.status(200).send({ data: reg });
        } else {
          res.status(404).send({ message: 'Departamento no encontrado.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al eliminar el departamento.' });
    }
  } else {
    res.status(403).send({ message: 'No tiene acceso para eliminar el departamento.' });
  }
};



  module.exports = {
    registro_departamento,
    listar_departamento,
    eliminar_departamento
  }