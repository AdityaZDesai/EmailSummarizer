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
      frequency_penalty: -1,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    return {
      success: true,
      data: response.data.choices[0].text,
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


processEmailFile()
  .then((subjects) => {

    if (subjects.length > 0) {
      return Summarise(subjects[0]);
    } else {
      console.log("No subjects found in the email file.");
    }
  })
  .then((result) => {
    if (result && result.success) {
      console.log("Summary:", result.data);
    } else if (result && result.error) {
      console.log("Error:", result.error);
    }
  })
  .catch((err) => {
    console.error('An error occurred:', err);
  });
