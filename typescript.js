import "dotenv/config";
import { OpenRouter } from "@openrouter/sdk";
import Firecrawl from "@mendable/firecrawl-js";
import readline from "node:readline";
import fs from "node:fs/promises";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const messages = [];

console.log("Chat started. Type your question and press Enter.");
console.log("Type 'read <filename>' to load a local file for debugging.");
console.log("Type 'scrape <url>' to pull a webpage into the chat.");
console.log("Type 'search <query>' to search the web and pull in results.");
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

    // Handle "scrape <url>" command
    if (trimmed.toLowerCase().startsWith("scrape ")) {
      const url = trimmed.slice(7).trim();
      try {
        console.log(`\nScraping ${url}...\n`);
        const result = await firecrawl.scrape(url, { formats: ["markdown"] });
        const pageContent = result.markdown || "(no content returned)";
        console.log(`Loaded page (${pageContent.length} chars). Ask your question about it.\n`);
        messages.push({
          role: "user",
          content: `Here is the content scraped from ${url}:\n\n${pageContent}\n\nPlease use this to answer my next question.`
        });
        await sendToModel();
      } catch (err) {
        console.log(`\nCould not scrape "${url}": ${err.message}\n`);
      }
      ask();
      return;
    }

    // Handle "search <query>" command
    if (trimmed.toLowerCase().startsWith("search ")) {
      const query = trimmed.slice(7).trim();
      try {
        console.log(`\nSearching for "${query}"...\n`);
        const results = await firecrawl.search(query, { limit: 5 });
        const items = results.web || [];
        const summary = items
          .map((item, i) => `${i + 1}. ${item.title || item.url}\n${item.url}\n${item.description || ""}`)
          .join("\n\n");
        console.log(`Found ${items.length} results. Ask your question about them.\n`);
        messages.push({
          role: "user",
          content: `Here are web search results for "${query}":\n\n${summary}\n\nPlease use this to answer my next question.`
        });
        await sendToModel();
      } catch (err) {
        console.log(`\nSearch failed: ${err.message}\n`);
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