const express = require('express');
const app = express();
const router = express.Router();

const fs = require('fs')
const http = require('http')
const pdf = require('html-pdf')
const tmpl = fs.readFileSync('assets/businesscard.html', 'utf8')

var model = {name: "Christophe Ramsamy", 
position: "Major Alpha Geek",
image: "http://localhost:4000/image.png"};

router.route('/preview').get(function(req, res){
    var html = tmpl;
    for (key in model){
        html = html.replace("{{"+key+"}}",model[key]);  
    }

    res.end(html);
});

router.route('/pdf').get(function(req, res){
    var html = tmpl;
    for (key in model){
        html = html.replace("{{"+key+"}}",model[key]);  
    }

    // res.end(html);

    pdf.create(html, {width: '50mm', height: '90mm'}).toFile('pdf/cardxxx.pdf', (err, obj) => {
        var stream = fs.readFileSync(obj.filename);
        console.log("wrote to file and sending");
        console.log(obj);
        res.setHeader('Content-type', 'application/pdf');
        res.end(stream);
    });
});

module.exports = router;
