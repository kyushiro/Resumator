var jwt = require('jsonwebtoken');
var dbconfig = require('../config/database');


const utils = {};

utils.getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
};

utils.getAuthUser =   function(token){
    return jwt.decode(token, dbconfig.secret);
};

module.exports = utils;