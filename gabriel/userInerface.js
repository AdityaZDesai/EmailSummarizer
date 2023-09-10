const express = require('express');
const path = require('path');
const morgan = require('morgan');
const ejs = require('ejs');
VIEWS_PATH = path.join(__dirname, '/views/');

let app = express();
const messages = [];

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
    res.redirect('/display-summary')

})

app.get('/display-summary', async function(req, res) {
    try {
      const summaries = await getAllSummaries();
      console.log
      res.render("showSummary", { summaries: summaries });
    } catch (err) {
      console.error('An error occurred:', err);
      res.status(500).send('Internal Server Error');
    }
  });





const fs = require('fs');
const readline = require('readline');
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function processEmailFile() {
  try {
    const fileStream = fs.createReadStream('emails.txt');
    
    const rl = readline.createInterface({ 
      input: fileStream,
      crlfDelay: Infinity
    });

    let isCapturing = false;
    let currentSubjectLines = [];
    const subjects = [];

    for await (const line of rl) {
      if (line.toLowerCase().includes('subject')) {
        if (isCapturing && currentSubjectLines.length > 0) {
          subjects.push(currentSubjectLines.join('\n'));
        }

        isCapturing = true;
        currentSubjectLines = [line];
      } else {
        if (isCapturing) {
          currentSubjectLines.push(line);
        }
      }
    }

    if (isCapturing && currentSubjectLines.length > 0) {
      subjects.push(currentSubjectLines.join('\n'));
    }

    return subjects;
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

async function Summarise(prompt) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
        ${prompt}

        Summarise this email, giving key information with specifics
        ###
      `,
      max_tokens: 100,
      temperature: 0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    return {
      success: true,
      data: response.data.choices[0].text.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    };
  }
}


async function getAllSummaries() {
  const summaries = [];
  try {
    const subjects = await processEmailFile();
    if (subjects.length > 0) {
      for (let i = 0; i < subjects.length; i++) {
        const result = await Summarise(subjects[i]);
        if (result.success) {
          summaries.push(`Summary of email ${i + 1}: ${result.data}`);
        } else {
          summaries.push(`Error summarizing email ${i + 1}: ${result.error}`);
        }
      }
    } else {
      summaries.push("No subjects found in the email file.");
    }
  } catch (err) {
    console.error('An error occurred:', err);
  }
  return summaries;
}

// Use the function to get the list of summaries
getAllSummaries().then(summaries => {
  console.log('All Summaries:', summaries);
}).catch(err => {
  console.error('An error occurred:', err);
});


app.listen(8080);