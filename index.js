const fs = require('fs')
const http = require('http')
const pdf = require('html-pdf')
const tmpl = fs.readFileSync('assets/businesscard.html', 'utf8')

var model = {name: "Christophe Ramsamy", 
position: "Major Alpha Geek",
image: `./assets/image.png`};

const server = http.createServer(function (req, res) {
  if (req.url === '/favicon.ico') return res.end('404')
  var html = tmpl;
  for (key in model){
	  html = html.replace("{{"+key+"}}",model[key]);  
  }
  
  pdf.create(html, {width: '50mm', height: '90mm'}).toFile('pdf/cardxxx.pdf', (err, obj) => {
	  var stream = fs.readFileSync(obj.filename);
	  console.log("wrote to file and sending");
	  console.log(obj);
	  res.setHeader('Content-type', 'application/pdf');
	  res.end(stream);
  });

/*
  pdf.create(html, {width: '50mm', height: '90mm'}).toStream((err, stream) => {
    if (err) return res.end(err.stack)
    res.setHeader('Content-type', 'application/pdf')
    stream.pipe(res)
  })
  */
})

server.listen(8082, function (err) {
  if (err) throw err
  console.log('Listening on http://localhost:%s', server.address().port)
})
