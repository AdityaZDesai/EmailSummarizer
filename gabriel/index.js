
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

<<<<<<< Updated upstream
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
=======
// Use the functions
processEmailFile()
  .then(async (subjects) => {
    if (subjects.length > 0) {
      for (let i = 0; i < subjects.length; i++) {
        const result = await Summarise(subjects[i]);
        if (result.success) {
          console.log(`Summary of email ${i + 1}: ${result.data}\n`);
        } else {
          console.log(`Error summarizing email ${i + 1}: ${result.error}\n`);
        }
      }
    } else {
      console.log("No subjects found in the email file.");
    }
  })
  .catch((err) => {
    console.error('An error occurred:', err);
  });
>>>>>>> Stashed changes
