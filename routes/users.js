var mongoose = require('mongoose');
var passport = require('passport');
var dbconfig = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var utils = require('./routeUtils');

  router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({success: false, msg: 'Please pass username and password.'});
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      // save the user
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Registration successful!'});
      });
    }
  });

  //TODO: remove this signup for admin endpoint
  router.post('/signup/admin', function (req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({success: false, msg: 'Please add a username and password.'});
    } else {
      //Adding an admin
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        role: 'admin'
      });
      console.log("newUser : ", newUser);
      // save the admin
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Admin registration successful!'});
      });
    }

  });


  router.post('/signin', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), dbconfig.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

  //Users list
  router.get("/list", passport.authenticate('jwt', { session: false}), function (req, res) {
    var authroles = ['admin'];
    var token = utils.getToken(req.headers);
    if (token) {
      var user = utils.getAuthUser(token);
      if (!(authroles.find(x => x == user.role))){
        console.log("Role "+user.role+" is not allowed access to this resource.");
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }

      let users = User.find().lean().exec(function (err, userlist) {
        // console.log("userlist : ", userlist);
        if(err) return res.status(400).json({sucess:false, message: err});
        return res.status(200).json({success: true, data: userlist});
      });

    } else {
      return res.status(403).send({sucess: false, message: "Unauthorized."})
    }

  });


  module.exports = router;