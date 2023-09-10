
const fs = require('fs');
const readline = require('readline');

async function processEmailFile() {
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
        // End the previous capturing, push the accumulated lines into subjects
        subjects.push(currentSubjectLines.join('\n'));
      }

      // Start a new capturing
      isCapturing = true;
      currentSubjectLines = [line];
    } else {
      if (isCapturing) {
        currentSubjectLines.push(line);
      }
    }
  }

  // Capture the last subject if it exists
  if (isCapturing && currentSubjectLines.length > 0) {
    subjects.push(currentSubjectLines.join('\n'));
  }

  return subjects
}

processEmailFile().catch(err => {
  console.error('An error occurred:', err);
});




require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function findComplexity(prompt) {
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

// Use the function
const prompt = processEmailFile()[2]
findComplexity(prompt)
  .then((result) => {
    if (result.success) {
      console.log("Summary:", result.data);
    } else {
      console.log("Error:", result.error);
    }
  });