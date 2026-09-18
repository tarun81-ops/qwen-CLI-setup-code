import "dotenv/config";
import { OpenRouter } from "@openrouter/sdk";
import readline from "node:readline";
import fs from "node:fs/promises";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const messages = [];

console.log("Chat started. Type your question and press Enter.");
console.log("Type 'read <filename>' to load a file for debugging (e.g. read app.js).");
console.log("Type 'exit' to quit.\n");

async function sendToModel() {
  const stream = await openrouter.chat.send({
    chatRequest: {
      model: "nvidia/nemotron-3-ultra-550b-a55b:free",
      messages: messages,
      stream: true
    }
  });

  process.stdout.write("AI: ");
  let response = "";

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      response += content;
      process.stdout.write(content);
    }
  }

  messages.push({ role: "assistant", content: response });
  console.log("\n");
}

function ask() {
  rl.question("You: ", async (input) => {
    const trimmed = input.trim();

    if (trimmed.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    // Handle "read <filename>" command
    if (trimmed.toLowerCase().startsWith("read ")) {
      const filename = trimmed.slice(5).trim();
      try {
        const fileContent = await fs.readFile(filename, "utf-8");
        console.log(`\nLoaded ${filename} (${fileContent.length} chars). Ask your question about it.\n`);
        messages.push({
          role: "user",
          content: `Here is the content of ${filename}:\n\n\`\`\`\n${fileContent}\n\`\`\`\n\nPlease review it.`
        });
        await sendToModel();
      } catch (err) {
        console.log(`\nCould not read "${filename}": ${err.message}\n`);
      }
      ask();
      return;
    }

    messages.push({ role: "user", content: trimmed });
    await sendToModel();
    ask();
  });
}

ask();