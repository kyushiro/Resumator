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

  
  router.get('/generate', function(req, res) {
    // 5e38ccd0-8a8e-11e8-b248-952218ec5f36
    Resume.findOne({"uuid" : "5b5aee10-8b3a-11e8-bf81-85a14625ffaa" }).lean().exec(function(err, resumedata){
        if (err || !resumedata) {
            return res.status(400).json({success:false, message: "an error has occured! "+err});
        }

        resumedata['theme_common_resources'] = Config.app_base_url+'/common';
        resumedata['theme_path'] = `${Config.app_base_url}/theme/${resumedata.theme}`;

        const compiledtpl = pug.compileFile(`assets/theme/${resumedata.theme}/index.pug`);
        const html = compiledtpl(resumedata);

        pdf.create(html).toStream((err, stream) => {
          if (err) return res.end(err.stack)
          res.setHeader('Content-type', 'application/pdf')
          stream.pipe(res)
        })
        // res.end(html);

    });
});






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