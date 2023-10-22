"use strict";

//variables
var Usuario = require("../models/usuario");
var Empleado = require("../models/empleado");
var fs = require("fs");
var path = require("path");

// registro de empleado
const registro_empleado = async function (req, res) {
  if (req.user && req.user) {
    if (req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
      const data = req.body;
      const empresaId = req.user.sub;
      var img_path = req.files.foto.path;
      var name = img_path.split("/");
      var portada_name = name[2];

      console.log(req.user.sub);
      // Verificar si ya existe un empleado con el mismo NIT
      const empleadoExistente = await Empleado.findOne({ nit: data.nit });
      if (empleadoExistente) {
        fs.unlinkSync(img_path); //no me guarda la foto
        // Si ya existe un empleado con el mismo NIT, eliminar el archivo de la imagen
        res
          .status(400)
          .send({ message: "Ya existe un empleado con este NIT." });
      } else {
        // Si no hay empleado con el mismo NIT, crear el nuevo empleado y guardar la imagen
        const nuevoEmpleado = new Empleado(data);
        nuevoEmpleado.slug = data.nombre
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
        nuevoEmpleado.foto = portada_name;
        nuevoEmpleado.empresaId = empresaId;
        try {
          await nuevoEmpleado.save(); // Guarda el empleado en la base de datos
          // Envía una respuesta con el nuevo empleado
          res.status(200).send({ data: nuevoEmpleado });
        } catch (error) {
          // Si hay un error al guardar el empleado, elimina el archivo de la imagen y envía un mensaje de error
          fs.unlinkSync(img_path);
          res.status(500).send({ message: "Error al guardar el empleado." });
        }
      }
    }
  }
};

//listar y filtro de usuarios
const listar_empleado = async function (req, res) {
  if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "CONTA" ) {
    const empresaId = req.user.sub; // Obtener la ID de la empresa del usuario autenticado
    try {
      let filtro = req.params["filtro"];
      let query = {
        empresaId: empresaId, // Filtrar por la ID de la empresa del usuario autenticado
      };
      if (filtro && filtro !== "null") {
        // Filtro por nombre y apellido de empleados dentro de la empresa
        query.$or = [
          { nombre: new RegExp(filtro, "i") },
          { apellido: new RegExp(filtro, "i") },
        ];
      }
      // Usar populate para obtener datos del departamento relacionado
      const empleados = await Empleado.find(query).populate("deparId");
      res.status(200).send({ data: empleados });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error en el servidor", data: undefined });
    }
  } else {
    res.status(403).send({ message: "Acceso no autorizado" });
  }
};

//Metodo que devuelve la URL de la imagen
const obtener_foto = async function (req, res) {
  var img = req.params["img"];

  fs.stat("./uploads/empleados/" + img, function (err) {
    if (!err) {
      let path_img = "./uploads/empleados/" + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = "./uploads/foto.png";
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

//metodo para eliminar empleado
const eliminar_empleado = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" ) {
      var id = req.params["id"];
      // Obtener el empleado de la base de datos
      const empleado = await Empleado.findById(id);
      // Verificar si el empleado existe en la base de datos
      if (!empleado) {
        return res.status(404).send({ message: "Empleado no encontrado." });
      }
      // Obtener el usuario asociado al empleado
      const usuario = await Usuario.findOne({ empleadoId: id });
      // Verificar si el usuario existe
      if (usuario) {
        // Si existe un usuario asociado a este empleado, no permitir la eliminación
        return res.status(400).send({ message: "Este empleado está siendo utilizado por un usuario y no puede ser eliminado." });
      }
       // Verificar si el empleado tiene una foto
       if (empleado.foto) {
        // Construir la ruta completa del archivo de la foto
        const rutaFoto =`./uploads/empleados/${empleado.foto}`;
        // Verificar si el archivo de la foto existe en el sistema de archivos antes de intentar eliminarlo
        if (fs.existsSync(rutaFoto)) {
          // Eliminar la fotografía del sistema de archivos
          fs.unlinkSync(rutaFoto);
          console.log('Archivo eliminado con éxito:', rutaFoto);
        } else {
          console.log('El archivo no existe en la ruta especificada:', rutaFoto);
        }
      } else {
        console.log('El empleado no tiene una foto asociada.');
      }
      // Eliminar el empleado de la base de datos
      const reg = await Empleado.findByIdAndRemove({ _id: id });
      // Enviar la respuesta
      res.status(200).send({ data: reg });
    } else {
      res.status(403).send({ message: "No tiene acceso para eliminar el empleado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al eliminar el empleado." });
  }
};


//obtener id empleado
const obtener_empleado = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "CONTA") {
      var id = req.params["id"];
      try {
        var reg = await Empleado.findById({ _id: id });
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

const obtener_empleados = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "CONTA" ) {
      var id = req.params["id"];
      try {
        var reg = await Empleado.findById({ _id: id }).populate('deparId');
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




//actualizar empleados
const actualizar_empleado = async function (req, res) {
  if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" ) {
    const empleadoId = req.params.id; // Obtener el ID del empleado de los parámetros de la URL
    const data = req.body; // Obtener los datos del cuerpo de la solicitud

    // Verificar si el empleado con el ID dado existe en la base de datos
    const empleadoExistente = await Empleado.findById(empleadoId);
    if (!empleadoExistente) {
      return res.status(404).send({ message: "Empleado no encontrado." });
    }

    // Eliminar la foto antigua si se proporciona una nueva
    if (req.files && req.files.foto) {
      // Eliminar la foto antigua si existe
      if (empleadoExistente.foto) {
        const rutaFotoAntigua = `./uploads/empleados/${empleadoExistente.foto}`;
        if (fs.existsSync(rutaFotoAntigua)) {
          fs.unlinkSync(rutaFotoAntigua);
        }
      }

      // Guardar la nueva foto
      var img_path = req.files.foto.path;
      var name = img_path.split("\\");
      var portada_name = name[2];
      empleadoExistente.foto = portada_name;
    }

    // Actualizar los campos del empleado con los nuevos datos
    empleadoExistente.nombre = data.nombre;
    empleadoExistente.apellido = data.apellido;
    empleadoExistente.telefono = data.telefono;
    empleadoExistente.nit = data.nit;
    empleadoExistente.dpi = data.dpi;
    empleadoExistente.direccion = data.direccion;
    empleadoExistente.civil = data.civil;
    empleadoExistente.tiene_hijos = data.tiene_hijos;
    empleadoExistente.pareja = data.pareja;
    empleadoExistente.num_hijos = data.num_hijos;
    empleadoExistente.nom_hijos = data.nom_hijos;
    empleadoExistente.fecha_contra = data.fecha_contra;
    empleadoExistente.salario_base = data.salario_base;
    empleadoExistente.deparId = data.deparId;

    try {
      // Guardar los cambios en la base de datos
      await empleadoExistente.save();

      // Envía una respuesta con el empleado actualizado
      res.status(200).send({ data: empleadoExistente });
    } catch (error) {
      // Si hay un error al guardar los cambios, envía un mensaje de error
      res.status(500).send({ message: "Error al actualizar el empleado." });
    }
  } else {
    res
      .status(403)
      .send({ message: "No tiene acceso para actualizar el empleado." });
  }
};


//METODO PARA CAMBIAR EL ESTADO A DESABILITADO
const desabilitar_Empleado = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
      var id = req.params["id"];

      // Obtener el empleado de la base de datos
      const empleado = await Empleado.findById(id);

      // Verificar si el empleado existe en la base de datos
      if (!empleado) {
        return res.status(404).send({ message: "Empleado no encontrado." });
      }

      // Cambiar el estado del empleado a "DESABILITADO"
      empleado.status = "DESABILITADO";
      await empleado.save();

      // Enviar la respuesta
      res.status(200).send({ message: "Empleado deshabilitado correctamente.", data: empleado });
    } else {
      res.status(403).send({ message: "No tiene acceso para deshabilitar el empleado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al deshabilitar el empleado." });
  }
};

//METODO PARA CAMBIAR EL ESTADO A DESABILITADO
const activar_Empleado = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
      var id = req.params["id"];

      // Obtener el empleado de la base de datos
      const empleado = await Empleado.findById(id);

      // Verificar si el empleado existe en la base de datos
      if (!empleado) {
        return res.status(404).send({ message: "Empleado no encontrado." });
      }

      // Cambiar el estado del empleado a "DESABILITADO"
      empleado.status = "ACTIVO";
      await empleado.save();

      // Enviar la respuesta
      res.status(200).send({ message: "Empleado activado correctamente.", data: empleado });
    } else {
      res.status(403).send({ message: "No tiene acceso para activar el empleado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al activar el empleado." });
  }
};



module.exports = {
  registro_empleado,
  listar_empleado,
  obtener_foto,
  eliminar_empleado,
  obtener_empleado,
  actualizar_empleado,
  desabilitar_Empleado,
  activar_Empleado,
  obtener_empleados
};
