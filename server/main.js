//This server is built for compatibility with Heroku
var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/'});
var fs = require('fs');
var Clarifai = require('clarifai');
var clarifai = new Clarifai.App(
  process.env.CLARIFAI_CLIENT_ID,
  process.env.CLARIFAI_CLIENT_SECRET
);

var checkImageForToast = function(imagePath){
  clarifai.models.predict(Clarifai.GENERAL_MODEL, imagePath).then(
  function(response) {
    console.log(response);
  },
  function(err) {
    return err;
  }
);
}

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', upload.single('toast'), function(req, res) {
  //add the uploaded file to the
  var file = __dirname + '/uploads/' + req.file.filename + path.extname(req.file.originalname);
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename + path.extname(req.file.originalname)
      });
    }
  });
  checkImageForToast(file)
});

app.listen(process.env.PORT || 5000, function () {
  console.log("Server listening on http://localhost:%s", process.env.PORT || 5000);
});
