//var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var random = require('random');
 

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //
        //
      var oldpath = files.filetoupload.path;
      var newpath = "imagefile/"+files.filetoupload.name;
      fs.copyFile(oldpath, newpath, function (err) {
        if (err){
            throw err;
        } else{
            // make a connection 
            var url = "mongodb://devlamine:formeduc@cluster0-shard-00-00.phlgv.mongodb.net:27017,cluster0-shard-00-01.phlgv.mongodb.net:27017,cluster0-shard-00-02.phlgv.mongodb.net:27017/sample_airbnb?ssl=true&replicaSet=atlas-zxw3cn-shard-0&authSource=admin&retryWrites=true&w=majority";
            
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("sample_airbnb");
              var aleatoire=random.int(100, 100000000000000);
              var myobj = { name_image: aleatoire+newpath };
              dbo.collection("imagedocuments").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
              });
            });
            //
           //res.write('File uploaded and moved!'+newpath);
           //
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>');
        res.write('<div class="container">');
        res.write('<div class="alert alert-success"><strong>Success ! </strong>Upload Reussi.</div>');
        res.write('</div>');
           //
          
        
        }
        
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>');
    res.write('<div class="container">');
    res.write('<div class="jumbotron"><h1 style="text-align:center">AJOUT DE FICHIER</h1></div>');
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<div class="form-group">');
    res.write('<label for="pwd">Selectionner un fichier</label>');
    res.write('<input type="file" name="filetoupload" class="form-control" required><br>');
    res.write('</div>');
    res.write('<input type="submit" class="btn btn-primary">');
    res.write('</form>');
    res.write('</div>');
    return res.end();
  }
 

}).listen();