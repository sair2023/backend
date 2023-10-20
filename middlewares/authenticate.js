"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "drd85739";

//Logica para verificacion de tokens
exports.auth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "NoHayCabeceraError" });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");

  var segment = token.split(".");

  if (segment.length != 3) {
    return res.status(403).send({ message: "TokenInvalido" });
  } else {
    try {
      var payload = jwt.decode(token, secret);

      //Validacion de expiracion del token
      if (payload.exp <= moment().unix()) {
        return res.status(403).send({ message: "TokenExpirado" });
      }
    } catch (error) {
      return res.status(403).send({ message: "TokenInvalido" });
    }
  }

  req.user = payload;

  next();
};
