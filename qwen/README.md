# Qwen Code CLI — Setup Guide

Qwen Code is an open-source, terminal-based AI coding agent. This guide covers installing it, connecting a model provider, and basic day-to-day usage.

## Prerequisites

- **Node.js 20+** — check with:
  ```bash
  node -v
  ```
  If missing or outdated, install from [nodejs.org](https://nodejs.org).

## Installation

### NPM (recommended)
```bash
npm install -g @qwen-code/qwen-code@latest
```

### Homebrew (macOS/Linux)
```bash
brew install qwen-code
```

After installing, restart your terminal so PATH updates take effect, then verify:
```bash
qwen --version
```

## Starting a Session

Navigate to your project folder and run:
```bash
cd path/to/your/project
qwen
```

This launches the interactive agent scoped to that folder.

## Authentication

Inside a session, run:
```
/auth
```

You'll be offered a few connection methods:

| Option | Use case |
|---|---|
| **Qwen OAuth** | Free tier via qwen.ai account sign-in (quota varies — check current limits) |
| **Alibaba ModelStudio** | Official Qwen models — Coding Plan (subscription), Token Plan (prepaid/teams), or Standard API Key (pay-as-you-go) |
| **Third-party Providers** | Built-in support for common providers (e.g. DeepSeek, MiniMax, Z.AI) |
| **Custom Provider** | Manually connect any OpenAI-compatible endpoint (e.g. OpenRouter, self-hosted, NVIDIA NIM) |

### Example: Connecting via OpenRouter (Custom Provider)

```
Base URL:  https://openrouter.ai/api/v1
API Key:   <your OpenRouter API key>
Model:     nvidia/nemotron-3-ultra-550b-a55b:free
```

Swap the model string for whichever model/provider combination you're using (e.g. drop `:free` for the paid tier if you hit rate limits).

## Updating Your API Key

Run `/auth` again and re-enter the Custom Provider details with your new key. If it doesn't cleanly overwrite the existing entry, edit the config file directly:

```
~/.qwen/settings.json
```

Update the key field, save, and restart your `qwen` session.

## Switching Models

```
/model
```

Lets you swap the active model without redoing full auth setup.

## IDE Integration (VS Code)

```
/ide install
```

Installs a companion VS Code extension so Qwen Code can see your open editor context.

## Basic Usage

Once connected, just type a prompt at the `>` cursor:

```
What does this project do?
Explain the codebase structure.
Help me refactor this function.
Generate unit tests for this module.
```

Reference specific files directly:
```
@path/to/file.js explain this
```

## Approval Modes

By default, an auto-approval classifier decides which actions (file edits, terminal commands) are safe to run without asking, and blocks risky ones.

- Toggle modes: **Shift+Tab** or `/approval-mode`
- Review diffs before accepting major multi-file changes, especially early on

## Stopping a Session

- Type `/quit` or `/exit`, or
- Press **Ctrl+C** twice (first press shows a confirmation prompt)

## Quick Reference

| Command | Purpose |
|---|---|
| `qwen` | Start a session in the current folder |
| `/auth` | Set up or update a provider/API key |
| `/model` | Switch the active model |
| `/ide install` | Connect the VS Code companion extension |
| `/approval-mode` | Change auto-approval behavior |
| `/quit` or `/exit` | End the session |
| `Ctrl+C` (x2) | Force quit |