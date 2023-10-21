"use strict";
//variables del sistema
var { getToken, getTokenData } = require("../helpers/jwtempresa");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
var jwt = require("../helpers/jwt");
var Empresa = require("../models/empresa");
var Usuario = require("../models/usuario");
var Empleado = require("../models/empleado");
const { getTemplete, sendEmail } = require("../helpers/mail");
var fs = require("fs");
var path = require("path");
//funcion para registrar empresa
const registro_empresa = async (req, res) => {
  try {
    // Obtener la data de la empresa
    const { nombre, direccion, correo, telefono, nit, password } = req.body;
    let empresa = await Empresa.findOne({ correo });
    // Verificar si el nombre ya existe en la base de datos
    const empresaNombre = await Empresa.findOne({ nombre });
    if (empresaNombre) {
      return res.status(200).json({
        message: "El nombre ya está registrado",
        duplicate: true,
      });
    }
    // Verificar si el correo ya existe en la base de datos
    const empresaCorreo = await Empresa.findOne({ correo });
    if (empresaCorreo) {
      return res.status(200).json({
        message: "El correo ya está registrado",
        duplicate: true,
      });
    }
    // Verificar si el NIT ya existe en la base de datos
    const empresaNit = await Empresa.findOne({ nit });
    if (empresaNit) {
      return res.status(200).json({
        message: "El NIT ya está registrado",
        duplicate: true,
      });
    }
    // Hashear la contraseña aleatoria antes de guardarla
    const saltRounds = 10; // Número de rondas de sal
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Generar el código
    const codigo = uuidv4();
    // Crear la empresa con la contraseña hasheada
    empresa = new Empresa({
      nombre,
      direccion,
      correo,
      password: hashedPassword,
      telefono,
      nit,
      codigo,
    });
    // Generar token
    const token = getToken({ correo, codigo });
    // Obtener el template de correo
    const temple = getTemplete(nombre, token);
    // Enviar correo electrónico
    await sendEmail(correo, "Verificación de Usuario", temple);
    // Guardar la empresa en la base de datos
    await empresa.save();
    //mensaje
    res.status(200).send({ message: "Se registró correctamente" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "Error al registrar",
    });
  }
};

// Función para enviar un correo con los datos de la empresa
async function enviarCorreoDatosVerificados(empresa) {
  const { nombre, correo } = empresa;

  // Construye el mensaje de correo
  const mensaje = `
  <html>

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Lastbit</title>
  </head>
  
  <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
    <table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#1B1B1B">
      <tbody>
        <tr>
          <td valign="top">
            <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0" bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
              <tbody>
                <tr>
                  <td colspan="4">
                    <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                    </table>
  
                    <!-- Main CONTENT -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tbody>
                        <tr>
                          <td height="40"></td>
                        </tr>
                        <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                          <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                              <tbody>
                                <tr>
                                  <td align="center" valign="bottom" colspan="2" cellpadding="3">
                                    <img alt="lastbit" width="300" src="https://i.imgur.com/76nOVY9.gif"/>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
                                      Hola  <strong>${nombre}</strong>
                                    </span>
  
                                  </td>
                                </tr>
                                <tr>
                                  <td height="24" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td height="1" bgcolor="#DAE1E9"></td>
                                </tr>
                                <tr>
                                  <td height="24" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td align="center"> <span style="color:#00204A;font-size:14px;line-height:24px;">
                                       Tu cuenta ha sido verificada con éxito. 🎉
                                    </span>
                                    <p style="color:#00204A;font-size:14px;line-height:24px;">
                                    <b>Gracias por registrarte en nuestra plataforma.</b></p>
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td valign="top" width="50%" align="center"> <span>
                                      <a href="https://sair.site/login/iniciar_sesion" style="display:block; padding:15px 25px; background-color:#80CC28; color:#ffffff; border-radius:7px; text-decoration:none;">Iniciar Sesion</a>
                                    </span>
  
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <img src="https://i.imgur.com/FjvPESc.png" width="54" height="2" border="0">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" &nbsp;=""></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  </html>
  `;
  try {
    // Envía el correo electrónico
    await sendEmail(correo, "Cuenta Verificada", mensaje);
  } catch (error) {
    console.error("Error al enviar el correo de datos verificados:", error);
  }
}

//FUNCION PARA VERIFICAR Empresa
const confirm = async (req, res) => {
  try {
    // Obtener el token
    const { token } = req.params;
    // Verificar la data
    const data = await getTokenData(token);
    if (data === null) {
      return res.json({
        success: false,
        msg: "Error al obtener data",
      });
    }
 
    const { codigo, correo } = data.data;
    // Verificar existencia del usuario
    const user = (await Empresa.findOne({ correo })) || null;
      if (user === null) {
      return res.json({
        success: false,
        msg: "Usuario no existe",
      });
    }
    // Verificar el código
    if (codigo !== user.codigo) {
      return res.redirect("https://www.sair.site/login/error");
    }
    // Actualizar usuario
    user.status = "VERIFICADO";
    await user.save();
    // Llama a la función para enviar el correo con los datos
    await enviarCorreoDatosVerificados(user);
    // Redireccionar a la confirmación
    return res.redirect("https://www.sair.site/login//confirmacion");
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "Error al confirmar usuario",
    });
  }
};
//login para empresas
const login_empresa = async function (req, res) {
  var data = req.body;
  var empresa_ar = [];
  empresa_ar = await Empresa.find({ correo: data.correo });
  if (empresa_ar.length == 0) {
    res
      .status(200)
      .send({
        message: "No se encontro el correo correspondiente",
        data: undefined,
      });
  } else {
    let empresa = empresa_ar[0];
    // Verificar el estado (status) de la empresa
    if (empresa.status !== "VERIFICADO") {
      res
        .status(200)
        .send({ message: "La cuenta no está verificada", data: undefined });
    } else {
      //validar correo y nit
      if (empresa.nit === data.nit && empresa.correo === data.correo) {
        //metodo para comprarar contraseñas
        bcrypt.compare(
          data.password,
          empresa.password,
          async function (error, check) {
            if (check) {
              res
                .status(200)
                .send({ data: empresa, token: jwt.createtoken(empresa) });
            } else {
              res
                .status(200)
                .send({
                  message: "La contraseña no coincide con el correo escrito",
                  data: undefined,
                });
            }
          }
        );
      } else {
        res
          .status(200)
          .send({
            message: "El correo o nit no coinciden los datos registrados",
            data: undefined,
          });
      }
    }
  }
};

//actualizar Empresa
const actualizar_empresa = async function (req, res) {
  if (req.user && req.user.rol === "EMPRESA" ) {
    const data = req.body; // Obtener los datos del cuerpo de la solicitud
    const empresaId = req.params.id;
    // Verificar si el ID dado existe en la base de datos
    const empresaExistente = await Empresa.findById(empresaId);
    if (!empresaExistente) {
      return res.status(404).send({ message: "Empresa no encontrada." });
    }

    // Eliminar la foto antigua si se proporciona una nueva
    if (req.files && req.files.logo) {
      // Eliminar la foto antigua si existe
      if (empresaExistente.logo) {
        const rutaFotoAntigua = `./uploads/empresas/${empresaExistente.logo}`;
        if (fs.existsSync(rutaFotoAntigua)) {
          fs.unlinkSync(rutaFotoAntigua);
        }
      }

      // Guardar la nueva foto
      var img_path = req.files.logo.path;
      var name = img_path.split("\\");
      var portada_name = name[2];
      empresaExistente.logo = portada_name;
    }
   // Hashear la nueva contraseña antes de guardarla
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(data.password, salt);
    // Actualizar los campos del empleado con los nuevos datos
    empresaExistente.nombre = data.nombre;
    empresaExistente.telefono = data.telefono;
    empresaExistente.direccion = data.direccion;
    empresaExistente.nit = data.nit;
    empresaExistente.correo = data.correo;
    empresaExistente.password = hashedPassword;


    try {
      // Guardar los cambios en la base de datos
      await empresaExistente.save();

      // Envía una respuesta con el empleado actualizado
      res.status(200).send({ data: empresaExistente });
    } catch (error) {
      // Si hay un error al guardar los cambios, envía un mensaje de error
      res.status(500).send({ message: "Error al actualizar la empresa." });
    }
  } else {
    res
      .status(403)
      .send({ message: "No tiene acceso para actualizar la empresa." });
  }
};

//obtener id empresa
const obtener_empresa = async function (req, res) {
  if (req.user) {
    if (req.user.rol === "EMPRESA") {
      var id = req.params["id"];
      try {
        var reg = await Empresa.findById({ _id: id });
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

//Metodo que devuelve la URL de la imagen
const obtener_foto = async function (req, res) {
  var img = req.params["img"];

  fs.stat("./uploads/empresas/" + img, function (err) {
    if (!err) {
      let path_img = "./uploads/empresas/" + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = "./uploads/foto.png";
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};


 // Obtener empleados por ID de empresa
 const obtenerEmpleadosPorEmpresa=  async function (req, res) {
  if (req.user) {
    if (req.user.rol === "EMPRESA") {
  const empresaId = req.params.empresaId;
  try {
    const empleados = await Empleado.find({ empresaId: empresaId });
    res.status(200).json({ data: empleados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener empleados.' });
  }
} else {
  res.status(500).send({ message: "No access" });
}
} else {
res.status(500).send({ message: "No access" });
}
}

  // Obtener usuarios por ID de empresa
  const obtenerUsuariosPorEmpresa = async function (req, res){
    if (req.user) {
      if (req.user.rol === "EMPRESA") {
    const empresaId = req.params.empresaId;
    try {
      const usuarios = await Usuario.find({ empresaId: empresaId });
      res.status(200).json({ data: usuarios });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
  } else {
    res.status(500).send({ message: "No access" });
  }
} else {
  res.status(500).send({ message: "No access" });
}
  }

module.exports = {
  actualizar_empresa,
  registro_empresa,
  confirm,
  login_empresa,
  obtener_empresa,
  obtener_foto,
  obtenerEmpleadosPorEmpresa,
  obtenerUsuariosPorEmpresa
};
