const express = require('express');
const pug = require('pug');
const app = express();
const router = express.Router();
const Config = require('../config');


const fs = require('fs')
const http = require('http')
const pdf = require('html-pdf')

const compiledtpl = pug.compileFile('assets/theme/simple/index.pug')
// const compiledtpl = pug.compileFile('assets/bcard.pug')

var model = {name: "Christophe Ramsamy", 
position: "Major Alpha Geek",
image: Config.app_base_url+"/image.png",
phone: "+230 57 12 74 42"};

model['app_base_url'] = Config.app_base_url;
model['linkedin'] = "http://google.com";
model['twitter'] = "http://google.com";
model['facebook'] = "http://google.com";
model['github'] = "http://google.com";
model['instagram'] = "http://google.com";
model['city'] = "Portland";
model['country'] = "OR";
model['phone_1'] = "534.456.886";
model['email'] = "hello@example.com";
model['website'] = "www.example.com";

const tmpl = compiledtpl(model);
// const tmpl = fs.readFileSync('assets/businesscard.html', 'utf8')


router.route('/preview').get(function(req, res){
    var html = tmpl;
    res.end(html);
});

router.route('/pdf').get(function(req, res){
    var html = tmpl;

    pdf.create(html).toFile('pdf/cardxxx.pdf', (err, obj) => {
        var stream = fs.readFileSync(obj.filename);
        res.setHeader('Content-type', 'application/pdf');
        res.end(stream);
    });
});

module.exports = router;
