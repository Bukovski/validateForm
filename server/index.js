const path = require('path');
const fs = require('fs');
const express = require("express");
const bodyParser = require('body-parser');
const Mustache = require("mustache");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.static('public'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


const SECRET_KEY = "my_secret_key";
let _token;


app.get("/", function (req, res) {
  const payload = {
    check:  true
  };
  
  _token = jwt.sign({ payload }, SECRET_KEY);
  
  fs.readFile(path.join(__dirname + '/../login.html'), 'utf8', (err, data) => {
    if (err) throw err;
    
    res.send(Mustache.render(data, { token: _token }))
  });
});

function ensureToken (req, res, next) {
  const tokenHeader = req.headers["x-access-token"];

  if (typeof tokenHeader !== "undefined" && tokenHeader === _token) {
    req.token = tokenHeader;
  
    next();
  } else {
    res.status(403).send("Woops token error");
  }
}

app.post("/api/verify", ensureToken, function (req, res) {
  jwt.verify(req.token, SECRET_KEY, function (err, data) {
    if (err) {
      res.status(403).send("Woops some wrong");
    } else {
      res.status(200).json({
        data: req.body
      })
    }
  });
});


app.listen(3000, function () {
  console.log("http://localhost:3000")
});