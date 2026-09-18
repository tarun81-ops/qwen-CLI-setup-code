# Agentic — OpenRouter Chat Script

A simple Node.js terminal chat app powered by the OpenRouter API, using the free `nvidia/nemotron-3-ultra-550b-a55b:free` model. Supports multi-turn conversation and loading local files into the chat for review/debugging.

## Prerequisites

- **Node.js** (v18 or newer recommended) — [download here](https://nodejs.org)
- An **OpenRouter API key** — sign up free at [openrouter.ai](https://openrouter.ai), then go to *Settings → API Keys* to generate one

## Setup

1. **Clone or copy this folder** to your machine.

2. **Install dependencies.** Open a terminal in this folder and run:
   ```bash
   npm install
   ```
   This installs `dotenv` and `@openrouter/sdk` (already listed in `package.json`).

3. **Get an OpenRouter API key.**
   1. Go to [openrouter.ai](https://openrouter.ai) and sign up (free — you can use Google/GitHub to sign in).
   2. Once logged in, click your profile icon (top right) → **Keys** (or go directly to [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)).
   3. Click **Create Key**.
   4. Give it a name (e.g. `agentic-local`) so you can identify it later.
   5. Click **Create**, then **copy the key immediately** — OpenRouter only shows it once. It will look like:
      ```
      sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      ```
   6. Store it somewhere safe temporarily (like a password manager) until you paste it into `.env` in the next step.

   ⚠️ Treat this key like a password. Anyone with it can make API calls billed to your account (if you add credits) or use up your free-tier limits.

4. **Add the key to this project.** Create a file named `.env` in this same folder (if it doesn't already exist) and add:
   ```
   OPENROUTER_API_KEY=your_actual_key_here
   ```
   No quotes, no spaces around the `=`.

   ⚠️ **Never commit `.env` to git or share it publicly.** Make sure it's listed in `.gitignore`.

5. **Run the script.**
   ```bash
   node typescript.js
   ```
   Or, on Windows, double-click `start.bat` (if present) to launch it without opening a terminal manually.

## Usage

Once running, you'll see a `You:` prompt in the terminal.

- Type any question and press Enter to chat.
- The conversation is remembered for the whole session (multi-turn).
- To load a file into the chat (e.g. for debugging), type:
  ```
  read <path-to-file>
  ```
  Examples:
  ```
  read app.js
  read C:\Users\yourname\some-project\index.js
  ```
  This loads the file's contents and sends it to the model automatically — no copy-pasting code.
- Type `exit` to quit the chat.

## Project Structure

```
agentic/
├── typescript.js     # Main chat script
├── .env              # Your API key (not committed to git)
├── package.json       # Project config & dependencies
├── node_modules/       # Installed packages (auto-generated)
└── start.bat          # (optional) Windows double-click launcher
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `ERR_MODULE_NOT_FOUND` | Run `npm install` again to make sure all dependencies are installed |
| `ERR_INVALID_PACKAGE_CONFIG` | Check `package.json` for a JSON syntax error (missing comma, bracket, etc.) |
| Module type warning | Make sure `package.json` includes `"type": "module"` |
| `read <file>` says "no such file" | Use the full absolute path to the file, or make sure it's in this folder |
| API key not loading | Check `.env` has no quotes/spaces, and confirm no conflicting system environment variable is already set under the same name |

## Notes

- The model used (`nvidia/nemotron-3-ultra-550b-a55b:free`) is free on OpenRouter, so no billing is required to use this script as-is.
- To switch models, change the `model:` value in `typescript.js` to any model ID listed on [openrouter.ai/models](https://openrouter.ai/models).
- This is a plain chat client — it does not yet have the ability to run commands or take actions on your machine (no tool/function calling implemented).
# for powershell
    cd "C:\Users\tarun verma\agentic"
    node typescript.js
    exit