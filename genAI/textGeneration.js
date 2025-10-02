const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const prompt = require("prompt-sync")();
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const question = prompt("Ask anything you want: ");

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(question);
  const answer = result.response.text();

  fs.mkdirSync("genAl", { recursive: true });
  fs.appendFileSync("genAl/answer.md", answer + "\n\n");

  console.log("Answer saved ✅\n", answer);
}

main();


// import fetch from "node-fetch";

// const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     contents: [{ role: "user", parts: [{ text: "Hello Gemini via REST!" }] }]
//   })
// });

// const data = await response.json();
// console.log(data.candidates[0].content.parts[0].text);