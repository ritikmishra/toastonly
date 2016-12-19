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

var forceHTTP = function(req, res, next){
  //logs where the request was made to
  console.log("Request made to " + req.originalUrl);
  //adds hsts header to response
  res.set('Strict-Transport-Security', ['max-age=60000', 'includeSubDomains']);
  //logs to console the user's connection scheme(http or https)
  console.log("Connection secure?")
  console.log(req.headers['x-forwarded-proto'])
  if(req.headers['x-forwarded-proto']!='https'){
    //redirects user to https website if currently using http
    res.redirect('https://uncensoredimageservice.herokuapp.com'+req.url)
  }
  else{
    next() /* Continue to other routes if we're not redirecting */
  }
}
app.use(forceHTTP)

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
        function(response) {https://automatically-generated-tweets.herokuapp.com
          var i = 0;
          res.send("<div  style='font-family: Helvetica; text-align: center'><h2>Sucessful upload</h2><p>Please beware that we ban unsafe images on our website. Examples of unsafe images include pictures of anything that isn't toast.</p><a href='https://uncensoredimageservice.herokuapp.com/'>Go back to see images</a></div>")
          var descriptors = response.data.outputs[0].data.concepts
          for(i = 0; i<10; i++){
            console.log(descriptors[i])
            if(((descriptors[i].name == 'bread')||(descriptors[i].name == 'toast'))&&(descriptors[i].value > '0.80')){

              var toast = __dirname + '/accesibleimages/' + req.file.filename + path.extname(req.file.originalname);
              fs.renameSync(file, toast);
              toastjson.images.unshift({"image": "https://uncensoredimageservice.herokuapp.com/" + req.file.filename + path.extname(req.file.originalname), "butters": 0})
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
          res.send("An error has occurede. We remain unsure whether or not your content is safe.\n\n" + err)
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
  console.log("Server listening on https://uncensoredimageservice.herokuapp.com:%s", process.env.PORT || 5000);
});
