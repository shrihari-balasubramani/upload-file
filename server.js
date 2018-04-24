// server.js
// where your node app starts

// init project
var express = require('express');
var app = express(),
    fs     = require('fs'),
    Busboy = require('busboy'),
    path = require('path');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('view engine', 'hbs');
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get('/upload',function(req,res, next){
	res.render('uploadFile');
});
app.post('/uploadToServer',function(req,res, next){
	var busboy = new Busboy({ headers: req.headers }),
	saveTo=path.resolve(__dirname+'/public/');
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename);
      saveTo = path.join(saveTo,filename);
      file.pipe(fs.createWriteStream(saveTo));
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
	    fs.stat(saveTo,function(err, stats){
	        if(err){
	                res.json({error:"error with the file."});
	        }else{
	        	res.json({uploadedFileSize:stats.size});
	        }
        fs.unlinkSync(saveTo);
	    });
	   })
    });
    return req.pipe(busboy);
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
