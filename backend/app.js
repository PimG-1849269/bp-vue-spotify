var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var bodyParser = require('body-parser');
const FileSystem = require("fs");

// HTTPS server
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


var cli_auth = require('./cli_auth.js');
const port = 4040;

var access_token = 0;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(bodyParser.json());

app.locals.storedState = null;


app.get('/', function(req, res) {
  res.send(`Hi! Server is listening on port ${port}`);
});

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  req.app.locals.storedState = state;

  // your application requests authorization
  res.send('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: cli_auth.client_id,
      scope: cli_auth.scope,
      redirect_uri: cli_auth.redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.app.locals.storedState;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch' + "sss" + state + "sss" + storedState
      }));
  } else {
    req.app.locals.storedState = null;

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: cli_auth.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(cli_auth.client_id + ':' + cli_auth.client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {

        res.redirect("https://localhost:8080/#/login?"
            + "access_token=" + body.access_token + '&'
            + "refresh_token=" + body.refresh_token + '&'
            + "expires_in=" + body.expires_in + '&'
            + "error=" + error
        );
    });
  }
});

app.post('/saveFeatures', function(req, res) {
  var allfeat = req.body
  
  FileSystem.writeFile('features.json', JSON.stringify(allfeat), (error) => {
      if (error) {
        res.send("Failed to save features: ", error)
      }
  });

  res.send(req.body);
});

// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
app.get('/shuffle', function(req, res) {
  var shufflefeat = req.query;
  shufflefeat = JSON.stringify(shufflefeat)

  const { spawn } = require('child_process');
  const pyProg = spawn('python3', [`${process.cwd()}/weightedshuffle.py`, shufflefeat]);

  pyProg.stdout.on('data', function(data) {
      res.send(data);
  });
  pyProg.stdout.on('error', function(err) {
    console.log("ERROR DURING SORTING:", err);
    res.send(err);
  }); 
});

// app.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(cli_auth.client_id + ':' + cli_auth.client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });

console.log('Listening on ', port);
// app.listen(port);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);
