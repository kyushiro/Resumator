var passport = require('passport');
var dbconfig = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Resume = require("../models/resume");
var utils = require('./routeUtils');
var UUIDv1 = require('uuid/v1');

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var authroles = ['user'];
    var token = utils.getToken(req.headers);
    if (token) {
      var user = utils.getAuthUser(token);
      if (!(authroles.find(x => x == user.role))){
        console.log("Role "+user.role+" is not allowed access to this resource.")
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
      }
      console.log("user "+user.username+" was granted access.");


      let newcv = req.body;
      newcv.user = user._id;
      let my_uuid = UUIDv1();
      newcv.uuid = my_uuid;
      let cv = new Resume(newcv);

      //todo: check if theme is authorized
      cv.save()
        .then(resume => { res.status(200).json({'message':'resume added successfully!'}); })
        .catch(err => { res.status(400).json({'error' : 'could not add resume, '+err }); })
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });



  //list my resumes
  router.get('/list', passport.authenticate('jwt', { session: false}), function(req, res) {
    var authroles = ['user'];
    var token = utils.getToken(req.headers);
    if (token) {
      var user = utils.getAuthUser(token);
      if (!(authroles.find(x => x == user.role))){
        console.log("Role "+user.role+" is not allowed access to this resource.")
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
      }
      console.log("user "+user.username+" was granted access.");


      let mycvs = Resume.find({"user": user._id}).lean().exec(function(err,cvlist){
          if (err) return res.status(400).json({success:false,})
          return res.status(200).json({success: true, data: cvlist});
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });



  router.get('/generate/:uuid', passport.authenticate('jwt', { session: false}), function(req, res) {
    var authroles = ['user'];
    var token = utils.getToken(req.headers);
    if (token) {
      var user = utils.getAuthUser(token);

      var resumedata = Resume.find({"uuid" : req.params.uuid }).lean().exec(function(err, result){
          if (err || !resumedata) return res.status(400).json({success:false, message: "an error has occured"});
          if (resumedata.user != user._id) return res.status(402).json({success:false, message: "User does not own this resume"});

          
      });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
  });

  // todo: make this more secure
  router.get("/wipe/:id",function(req,res){
    Resume.findByIdAndRemove(req.params.id).exec(function(err,result){
        if (err) console.log("could not delete, "+err);
        res.status(200).json({'message': "yay"});
    });
  });

module.exports = router;