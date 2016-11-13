//This server is built for compatibility with Heroku
var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });



var forceHTTP = function(req, res, next){
  //heroku specific function
  //do not use as middleware when testing locally

  
  //logs where the request was made to
  console.log("Request made to " + req.originalUrl);
  //adds hsts header to response
  res.set('Strict-Transport-Security', ['max-age=60000', 'includeSubDomains']);
  //logs to console the user's connection scheme(http or https)
  //console.log("Connection secure?")
  //console.log(req.headers['x-forwarded-proto'])
  if(req.headers['x-forwarded-proto']!='https'){
    //redirects user to https website if currently using http
    res.redirect('https://uncensoredimageservice.herokuapp.com/'+req.url)
  }
  else{
    next() /* Continue to other routes if we're not redirecting */
  }
}


//app.use(forceHTTP);

app.post('/upload', function (req, res) {
    res.send('req recieved')
});

app.get('/photos', function(req, res){

});
app.listen(process.env.PORT || 5000, function () {
  console.log("Server listening on http://localhost:%s", process.env.PORT || 5000);
});
