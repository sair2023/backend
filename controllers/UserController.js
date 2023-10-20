"use strict";

//variables
var Empresa = require("../models/empresa")
var Usuario = require("../models/usuario");
var bcrypt = require("bcrypt");
var jwt = require("../helpers/jwtusuario");

//registro de usuarios
const registro_usuario = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
      const data = req.body;
      const empresaId = req.user.sub;
      console.log(req.user.sub);
      
      // Verificar si ya existe un usuario con el correo proporcionado
      const usuarioExistenteCorreo = await Usuario.findOne({ correo: data.correo });
      if (usuarioExistenteCorreo) {
        return res.status(400).send({ message: "El correo ya está registrado", data: undefined });
      }

      // Verificar si ya existe un usuario con el ID del empleado proporcionado
      const usuarioExistenteEmpleadoId = await Usuario.findOne({ empleadoId: data.empleadoId });
      if (usuarioExistenteEmpleadoId) {
        return res.status(400).send({ message: "El ID del empleado ya está registrado", data: undefined });
      }

      if (data.password) {
        const hash = await bcrypt.hash(data.password, 10);

        if (hash) {
          data.password = hash;
          const nuevoUsuario = new Usuario(data); // Crea un nuevo objeto de usuario
          nuevoUsuario.empresaId = empresaId; // Asigna empresaId manualmente
          await nuevoUsuario.save(); // Guarda el usuario en la base de datos
          res.status(200).send({
            message: "Usuario registrado con éxito",
            data: nuevoUsuario,
          });
        } else {
          res.status(501).send({ message: "Error", data: undefined });
        }
      } else {
        res.status(400).send({
          message: "No se proporcionó una contraseña",
          data: undefined,
        });
      }
    } else {
      res.status(403).send({ message: "Acceso no autorizado", data: undefined });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error en el servidor", data: undefined });
  }
};

const login_usuario = async function (req, res) {
  var data = req.body;
  var usuario_ar = [];

  try {
    // Buscar usuario por correo electrónico
    usuario_ar = await Usuario.find({ correo: data.correo , status: 'ACTIVO'  });

    if (usuario_ar.length == 0) {
      res.status(200).send({
        message: "No se encontró el correo correspondiente",
        data: undefined,
      });
    } else {
      let user = usuario_ar[0];
      bcrypt.compare(data.password, user.password, async function (error, check) {
        if (check) {
       // Obtener información de la empresa asociada al usuario
      let empresa = await Empresa.findById(user.empresaId); // Suponiendo que tengas un modelo de Empresa con el método findById

      if (!empresa) {
        res.status(200).send({
          message: "No se encontró información de la empresa asociada al usuario",
          data: undefined,
        });
      } else {
        // Acceder al NIT de la empresa
        let nitEmpresa = empresa.nit;
        console.log(empresa.nit)
        // Verificar si el NIT de la empresa coincide
        if (data.nit === nitEmpresa) {
          res.status(200).send({ data: user, token: jwt.createtoken(user) });
        } else {
          res.status(200).send({
            message: "El NIT de la empresa no coincide con el usuario",
            data: undefined,
          });
        }
      }

        } else {
          // Contraseña incorrecta
          res.status(200).send({
            message: "La contraseña no coincide con el usuario",
            data: undefined,
          });
        }
      });
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error en el servidor",
      data: undefined,
    });
  }
};


//listar y filtro de usuarios
const listar_usuario = async function (req, res) {
  if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA") {
    const empresaId = req.user.sub; // Obtener la ID de la empresa del usuario autenticado
    try {
      let filtro = req.params["filtro"];
      let query = {
        empresaId: empresaId, // Filtrar por la ID de la empresa del usuario autenticado
      };
      if (filtro && filtro !== "null") {
        // Filtro por nombre y correo de usuarios dentro de la empresa
        query.$or = [
          { nombre: new RegExp(filtro, "i") },
          { correo: new RegExp(filtro, "i") },
        ];
      }
      const usuarios = await Usuario.find(query).populate("empleadoId");
      res.status(200).send({ data: usuarios });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error en el servidor", data: undefined });
    }
  } else {
    res.status(403).send({ message: "Acceso no autorizado" });
  }
};


//metodo para eliminar usuarios
const eliminar_usuario = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN"|| req.user.rol === "EMPRESA") {
      var id = req.params["id"];

      // Obtener el empleado de la base de datos
      const usuario = await Usuario.findById(id);

      // Verificar si el empleado existe en la base de datos
      if (!usuario) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      // Eliminar el empleado de la base de datos
      const reg = await Usuario.findByIdAndRemove({ _id: id });

      // Enviar la respuesta
      res.status(200).send({ data: reg });
    } else {
      res
        .status(403)
        .send({ message: "No tiene acceso para eliminar el usuario." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al eliminar el usuario." });
  }
};

//inactivar el usuario
const deshabilitar_usuarios = async function (req, res) {
  try {
    // Verificar si el usuario tiene privilegios de administrador
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" ) {
      let ids = req.params.ids.split(',');

      // Validar los identificadores de usuario
      if (!ids || ids.length === 0) {
        return res.status(400).send({ message: "ID de usuario no válido." });
      }

      // Deshabilitar usuarios
      const usuariosDeshabilitados = [];
      for (const id of ids) {
        const usuario = await Usuario.findById(id);

        // Validar si el usuario existe
        if (usuario) {
          usuario.status = "DESABILITADO";
          await usuario.save();
          usuariosDeshabilitados.push(usuario);
        } else {
          // Manejar el caso cuando el usuario no existe
          console.log(`Usuario con ID ${id} no encontrado.`);
        }
      }

      // Enviar la respuesta con los usuarios deshabilitados
      res.status(200).send({ message: "Usuarios deshabilitados correctamente.", usuarios: usuariosDeshabilitados });
    } else {
      // Enviar respuesta si el usuario no tiene privilegios de administrador
      res.status(403).send({ message: "No tiene acceso para deshabilitar usuarios." });
    }
  } catch (error) {
    // Manejar errores internos del servidor
    console.error(error);
    res.status(500).send({ message: "Error al deshabilitar usuarios." });
  }
};

//metodo para activar usuario
const activar_usuario = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" ) {
      var id = req.params["id"];

      // Obtener el usuario de la base de datos
      const usuario = await Usuario.findById(id);

      // Verificar si el usuario existe en la base de datos
      if (!usuario) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      // Actualizar el estado del usuario a "ACTIVO"
      usuario.status = "ACTIVO";
      await usuario.save();

      // Enviar la respuesta
      res.status(200).send({ message: "Usuario activado correctamente.", data: usuario });
    } else {
      res.status(403).send({ message: "No tiene acceso para activar el usuario." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al activar el usuario." });
  }
};

//Habilitar el usuario
const habilitar_usuarios = async function (req, res) {
  try {
    // Verificar si el usuario tiene privilegios de administrador
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" ) {
      let ids = req.params.ids.split(',');

      // Validar los identificadores de usuario
      if (!ids || ids.length === 0) {
        return res.status(400).send({ message: "ID de usuario no válido." });
      }

      // Deshabilitar usuarios
      const usuariosHabilitados = [];
      for (const id of ids) {
        const usuario = await Usuario.findById(id);

        // Validar si el usuario existe
        if (usuario) {
          usuario.status = "ACTIVO";
          await usuario.save();
          usuariosHabilitados.push(usuario);
        } else {
          // Manejar el caso cuando el usuario no existe
          console.log(`Usuario con ID ${id} no encontrado.`);
        }
      }

      // Enviar la respuesta con los usuarios deshabilitados
      res.status(200).send({ message: "Usuarios habilitados correctamente.", usuarios: usuariosHabilitados });
    } else {
      // Enviar respuesta si el usuario no tiene privilegios de administrador
      res.status(403).send({ message: "No tiene acceso para habilitar usuarios." });
    }
  } catch (error) {
    // Manejar errores internos del servidor
    console.error(error);
    res.status(500).send({ message: "Error al habilitar usuarios." });
  }
};

//editar usuario
const actualizar_usuario = async function (req, res) {
  try {
    if (req.user && req.user.rol === "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE" ) {
      const id = req.params.id;
      const { empleadoId, correo, rol, password } = req.body;

      // Obtener el usuario de la base de datos
      const usuario = await Usuario.findById(id);

      // Verificar si el usuario existe en la base de datos
      if (!usuario) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }
      // Hashear la nueva contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Actualizar campos del usuario
      usuario.empleadoId = empleadoId;
      usuario.correo = correo;
      usuario.password = hashedPassword; // Guardar la contraseña hasheada;
      usuario.rol = rol;

      // Guardar los cambios en el usuario
      await usuario.save();

      // Enviar la respuesta
      res.status(200).send({ message: "Usuario actualizado correctamente.", data: usuario });
    } else {
      res.status(403).send({ message: "No tiene acceso para actualizar el usuario." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al actualizar el usuario." });
  }
};

//obtener id usuario
const obtener_usuario = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE") {
      var id = req.params["id"];
      try {
        var reg = await Usuario.findById({ _id: id });
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

//obtener id usuario
const obtener_usuario2 = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "ADMIN" || req.user.rol === "EMPRESA" || req.user.rol === "EMPLE") {
      var id = req.params["id"];
      try {
        var reg = await Usuario.findById({ _id: id }).populate('empleadoId');
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
  registro_usuario,
  login_usuario,
  listar_usuario,
  eliminar_usuario,
  deshabilitar_usuarios,
  activar_usuario,
  habilitar_usuarios,
  actualizar_usuario,
  obtener_usuario,
  obtener_usuario2
};
