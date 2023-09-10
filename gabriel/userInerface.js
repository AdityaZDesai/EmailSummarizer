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
    let dataToSend;
    let username = req.body.email
    let password = req.body.password
    console.log(password)
    const cp = require('child_process')
    const python = cp.spawn('python', ['parser.py', username, password])
    python.stdout.on('data', function (data){ dataToSend = data.toString()})
    python.stderr.on('data', data=> {console.error(`stderr: ${data}`)});
    python.on('exit', (code)=> {console.log(`child process exited with code ${code}, ${dataToSend}`);
    res.sendFile(`${__dirname}/views/index.html`)
}
   )
    res.redirect('/')

})

app.listen(8080);