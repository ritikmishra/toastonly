//This server is built for compatibility with Heroku
var express = require('express');
var toastjson = require('./toast.json')
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


app.use(express.static('ui_files/www'))
app.use(express.static('accesibleimages'))
app.use(express.static('./toast.json'))
app.get('/', function(req, res){
  res.sendFile();
});

app.post('/upload', upload.single('toast'), function(req, res) {
  //add the uploaded file to the
  var file = __dirname + '/uploads/' + req.file.filename + path.extname(req.file.originalname);
  fs.rename(req.file.path, file, function(err) {
    fs.readFile(file, function(err, data){
      if(err) throw err;
      var base64Image = new Buffer(data).toString('base64');
      clarifai.models.predict(Clarifai.FOOD_MODEL, base64Image).then(
        function(response) {
          var i = 0;
          res.send("<h2 style='font-family: Helvetica'>Sucessful upload</h2><a href='http://localhost:5000'>Go back to see images</a>")
          var descriptors = response.data.outputs[0].data.concepts
          for(i = 0; i<10; i++){
            if(((descriptors[i].name == 'bread')||(descriptors[i].name == 'toast'))&&(descriptors[i].value > '0.85')){
              var toast = __dirname + '/accesibleimages/' + req.file.filename + path.extname(req.file.originalname);
              fs.renameSync(file, toast);
              toastjson.images.unshift({"image": "http://localhost:5000/" + req.file.filename + path.extname(req.file.originalname), "butters": 0})
              fs.writeFile('./toast.json', JSON.stringify(toastjson, null, 2), function(err, callback){
                if(err) throw err;
              })
              console.log('we added a toast');
              break;
            }

          }
          //res.send(response.data.outputs[0].data);
        },
        function(err) {
          res.send("we did a wrong")
          console.log(err);
        }
      );
    })

  });

});

app.get('/toast.json', function(req, res){
  var file = fs.readFile('toast.json', 'utf8', function callback(err, css){
    if (err) return console.error(err);
    res.type('application/json')
    res.send(css)
  });
})

app.listen(process.env.PORT || 5000, function () {
  console.log("Server listening on http://localhost:%s", process.env.PORT || 5000);
});
