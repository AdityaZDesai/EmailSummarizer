const express = require('express');
const path = require('path');
const morgan = require('morgan');
const ejs = require('ejs');
VIEWS_PATH = path.join(__dirname, '/views/');

let app = express();


app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("css"))

app.use(express.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(morgan('short'));


app.get('/', function(req,res){
    fileName = VIEWS_PATH + 'index.html';
    res.sendFile(fileName);
})

app.post('/aaa', function(req,res){
    let username = req.body.email
    let password = req.body.password
    console.log(password)
    res.redirect('/')

})

app.listen(8080);