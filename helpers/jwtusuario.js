'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'drd85739';

exports.createtoken = function(user) {
    var payload = {
        sub: user.empresaId,
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    };

    return jwt.encode(payload, secret);
};
