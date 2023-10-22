"use strict";

//variables
var fs = require("fs");
var path = require("path");
var Expediente = require("../models/expediente");

//metodo para registrar un expediente de un empleado
const registro_expediente = async function (req, res) {
    if (req.user && req.user) {
        if (req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
          const data = req.body;
          const empresaId = req.user.sub;
          //penales
          var img_path = req.files.penales.path;
          var name = img_path.split("/");
          var portada_name = name[2];
          //dpi
          var dpi_path = req.files.dpi.path;
          var namee = dpi_path.split("/");
          var dpi_name = namee[2];   
         //policiacos
         var poli_path = req.files.policiacos.path;
         var nameee = poli_path.split("/");
         var poli_name = nameee[2];   
          console.log(req.user.sub);
          // Verificar si ya existe un expediente con el mismo id de empleado
          const expedienteExistente = await Expediente.findOne({ empleadoId: data.empleadoId });
          if (expedienteExistente) {
            fs.unlinkSync(img_path); //no me guarda el archivo
            fs.unlinkSync(dpi_path); //no me guarda el archivo
            fs.unlinkSync(poli_path); //no me guarda el archivo
            // Si ya existe un expediente con el mismo id, eliminar el archivo
            res
              .status(400)
              .send({ message: "Ya existe un expediente con este Empleado." });
          } else {
            // Si no hay expediente con el mismo empleado, crear el nuevo expediente y guardar los archivos
            const nuevoExpediente = new Expediente(data);
            nuevoExpediente.penales = portada_name;
            nuevoExpediente.dpi = dpi_name;
            nuevoExpediente.policiacos = poli_name;
            nuevoExpediente.empresaId = empresaId;
            try {
              await nuevoExpediente.save(); // Guarda el expediente en la base de datos
              // Envía una respuesta con el nuevo expediente
              res.status(200).send({ data: nuevoExpediente });
            } catch (error) {
              // Si hay un error al guardar el expediente, elimina el archivo y envía un mensaje de error
              fs.unlinkSync(img_path); //no me guarda el archivo
              fs.unlinkSync(dpi_path); //no me guarda el archivo
              fs.unlinkSync(poli_path); //no me guarda el archivo
              res.status(500).send({ message: "Error al guardar el expediente." });
            }
          }
        }
      }
  };

//metodo para listar expedientes
const listar_expediente = async function(req, res){
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE" ) {
      const empresaId = req.user.sub;
      const empleadoId = req.params.empleadoId;
      // Consulta los expedientes donde la empresaId coincide con la ID de la empresa del usuario
      const expediente = await Expediente.find({ empresaId: empresaId, empleadoId: empleadoId }).populate('empleadoId');

      res.status(200).json(expediente);
    } else {
      res.status(403).send({ message: "Acceso no autorizado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error al obtener la lista de expedientes' });
  }
}

//Metodo que devuelve la URL de los pdf
const obtener_pdf = async function (req, res) {
  var pdf = req.params["pdf"];

  fs.stat("./uploads/expedientes/" + pdf, function (err) {
    if (!err) {
      let path_img = "./uploads/expedientes/" + pdf;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = "./uploads/foto.png";
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};


const editar_expediente = async function (req, res) {
  if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE") {
    const empleadoId = req.params.id; // Obtener el ID de los parámetros de la URL
    const data = req.body; // Obtener los datos del cuerpo de la solicitud

      const expedienteExistente = await Expediente.findOne({ empleadoId });

      if (!expedienteExistente) {
        return res.status(404).send({ message: "Expediente no encontrado." });
      }

      // Eliminar el archivo antiguo si se proporciona uno nuevo
      if (req.files && req.files.penales) {
        // Eliminar la foto antigua si existe
        if (expedienteExistente.penales) {
          const rutaAntigua = `./uploads/expedientes/${expedienteExistente.penales}`;
          if (fs.existsSync(rutaAntigua)) {
            fs.unlinkSync(rutaAntigua);
          }
        }

        // Guardar el archivo nuevo
        var img_path = req.files.penales.path;
        var name = img_path.split("/");
        var portada_name = name[2];
        expedienteExistente.penales = portada_name;
      }
      //       // Eliminar el archivo antiguo si se proporciona uno nuevo
      if (req.files && req.files.dpi) {
        // Eliminar la foto antigua si existe
        if (expedienteExistente.dpi) {
          const rutaAntigua = `./uploads/expedientes/${expedienteExistente.dpi}`;
          if (fs.existsSync(rutaAntigua)) {
            fs.unlinkSync(rutaAntigua);
          }
        }
        //dpi nuevo
        var dpi_path = req.files.dpi.path;
        var namee = dpi_path.split("/");
        var dpi_name = namee[2];
        expedienteExistente.dpi = dpi_name;
      }
      //       // Eliminar el archivo antiguo si se proporciona uno nuevo
      if (req.files && req.files.policiacos) {
        // Eliminar la foto antigua si existe
        if (expedienteExistente.policiacos) {
          const rutaAntigua = `./uploads/expedientes/${expedienteExistente.policiacos}`;
          if (fs.existsSync(rutaAntigua)) {
            fs.unlinkSync(rutaAntigua);
          }
        }
        //policiacos nuevos
        var poli_path = req.files.policiacos.path;
        var nameee = poli_path.split("\\");
        var poli_name = nameee[2];
        expedienteExistente.policiacos = poli_name;
      }

      expedienteExistente.fecha_creacion = data.fecha_creacion;
  
      try {
        // Actualizar el expediente en la base de datos
        await expedienteExistente.save();

        return res.status(200).send({ message: "Expediente actualizado correctamente.", data: expedienteExistente });
      } catch (error) {
        // Si hay un error al guardar los archivos, puedes manejarlo aquí si es necesario
        return res.status(500).send({ message: "Error al guardar los archivos." });
      }
  } else {
    return res.status(403).send({ message: "No tienes permisos para realizar esta acción." });
  }
};

//obtener id expediente
const expediente_empleado = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE" ) {
      var id = req.params["id"];
      try {
        var reg = await Expediente.findById({ _id: id });
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



  module.exports = {
    registro_expediente,
    obtener_pdf,
    listar_expediente,
    editar_expediente,
    expediente_empleado
  }
