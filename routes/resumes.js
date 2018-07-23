var passport = require('passport');
var dbconfig = require('../config/database');
const Config = require('../config/general');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Resume = require("../models/resume");
var Theme = require("../models/theme");
var utils = require('./routeUtils');
var UUIDv1 = require('uuid/v1');
var fs = require("fs");
const pug = require('pug');
const pdf = require('html-pdf')

// add a resume for authed user
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


  // delete resume if belongs to authed user
  router.delete("/:id", passport.authenticate('jwt', { session: false}), function(req,res){
    var authroles = ['user'];
    var token = utils.getToken(req.headers);
    if (token){
      var user = utils.getAuthUser(token);
      if (!(authroles.find(x => x == user.role))){
        console.log("Role "+user.role+" is not allowed access to this resource.")
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
      }

      Resume.findOne({"_id": req.params.id}, function(err, resume){
          if (resume.user != user._id) return res.status(403).json({'success': false, msg: "Resume can only be deleted by creator"});
          resume.remove(function(err, result){
            if (err){
                console.log("could not delete, "+err);
                return res.status(403).json({'success': false, msg: "Deletion failed, "+err});
            }
            res.status(200).json({'message': "Deletion successful"});  
          })
        });
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

      Resume.findOne({"uuid" : req.params.uuid }).lean().exec(function(err, resumedata){
          if (err || !resumedata) {
              return res.status(400).json({success:false, message: "an error has occured! "+err});
          }
          if (resumedata.user != user._id) {
              console.log(resumedata);
              console.log(user._id);
              return res.status(402).json({success:false, message: "User does not own this resume"});
          }

          // todo validate if user cn use theme


          resumedata['theme_common_resources'] = Config.app_base_url+'/common';
          resumedata['theme_path'] = `${Config.app_base_url}/theme/${resumedata.theme}`;

          const compiledtpl = pug.compileFile(`assets/theme/${resumedata.theme}/index.pug`);
          const html = compiledtpl(resumedata);

          pdf.create(html).toStream((err, stream) => {
            if (err) return res.end(err.stack)
            res.setHeader('Content-type', 'application/pdf')
            stream.pipe(res)
          })

      });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
  });


  // 


  router.get('/preview', function(req, res) {
      // 5e38ccd0-8a8e-11e8-b248-952218ec5f36
      Resume.findOne({"uuid" : "5b5aee10-8b3a-11e8-bf81-85a14625ffaa" }).lean().exec(function(err, resumedata){
          if (err || !resumedata) {
              return res.status(400).json({success:false, message: "an error has occured! "+err});
          }

          resumedata['theme_common_resources'] = Config.app_base_url+'/common';
          resumedata['theme_path'] = `${Config.app_base_url}/theme/${resumedata.theme}`;

          const compiledtpl = pug.compileFile(`assets/theme/${resumedata.theme}/index.pug`);
          const html = compiledtpl(resumedata);

          res.end(html);

      });
  });


  // todo: make this more secure

  router.post("/themes/register/:name",function(req,res){
      var themename = req.params.name;
       Theme.find({"name": themename}).lean().exec(function(err,result){
          if (err || result){ 
              console.log(result)
              return res.status(400).json({success:false, message: err? err : "Theme already exists"});
          }
          let themeref = UUIDv1();

          var tmp = req.body;
          tmp.reference = themeref;
          mytheme = new Theme(tmp);
          mytheme.save()
          .then(resume => { res.status(200).json({'message':'theme added successfully!'}); })
          .catch(err => { res.status(400).json({'error' : 'could not add theme, '+err }); })
      });
  });





module.exports = router;