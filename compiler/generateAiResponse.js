const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Post-process AI response to ensure markdown headings
const formatAsMarkdown = (text) => {
  return text
    .replace(/^AI Code Review$/gm, "# AI Code Review")
    .replace(/^Code Analysis$/gm, "## Code Analysis")
    .replace(/^Errors & Suggestions$/gm, "## Errors & Suggestions")
    .replace(/^Summary$/gm, "## Summary");
};

const generateAiResponse = async (code) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an expert code reviewer. Please analyze the following code and format your response STRICTLY in markdown using actual markdown syntax:
  - Use #, ##, ### for headings (not just bold or plain text)
  - Use - or * for bullet points
  - Do NOT repeat the title 'AI Code Review' in the body
  - Do NOT use plain text or pseudo-headings, only markdown

  ## Code Analysis
  - Briefly state if the code is correct and solves the intended problem.

  ## Errors & Suggestions
  - If there are errors (syntax, logic, or otherwise), list ONLY the most important ones as bullet points (max 5).
  - For each error, provide a short fix as a sub-bullet.

  ## Summary
  - If the code is correct, reply with a short confirmation and a concise explanation (max 5 lines) of how it works.

  ---

  Code to review:

  \`\`\`
  ${code}
  \`\`\`
  `,
  });
  const formatted = formatAsMarkdown(response.text);
  console.log(formatted);
  return formatted;

  //   const response = await ai.models.generateContent({
  //     model: "gemini-2.0-flash",
  //     contents:
  //       "Analyze the following code and provide a short and concise review of the code. Also, provide a list of potential improvements and suggestions for the code. " +
  //       code,
  //   });
  //   return response.text;
};

module.exports = generateAiResponse;
