---
title: "Claude Code Guide"
description: "6 months of Claude Code setup compressed into one MD file. Every MCP, plugin, and trick I use daily."
tags: ["Guide", "AI", "Productivity", "Claude"]
priceTier: "free"
status: "live"
tools: ["Claude Code", "MCP Servers", "Superpowers", "Context Mode", "Claude Mem", "Firecrawl", "Playwright", "GSD Workflow"]
publishedAt: 2026-04-08
downloadUrl: "https://zeenomena-site.netlify.app/downloads/claude-code-setup-guide.md"
---

Downloading Claude Code was a pain in the ass. It took me a full day to get it set up properly. 6 months later, I've upgraded it with the most useful MCPs, plugins, tools, and workflows out there. Below is an MD file that contains a step by step guide to get an optimal Claude Code setup in minutes rather than 6 months.

You need to do the manual stuff yourself from step 1 to step 7 (installing Node, Python, WSL, Claude Code itself). But after that, just give it to Claude Code and let it work it out with you!

## What's Free and What's Paid

**Free:** The full guide. Download it, set it up, you're golden.

## What's in the MD File?

### MCP Servers

| Tool | What It Does | Link |
|------|-------------|------|
| Context Mode | Keeps your context window clean. Runs commands in sandbox, only summaries enter your chat. | [github.com/bsmith/context-mode](https://github.com/bsmith/context-mode) |
| Firecrawl | Scrapes websites, crawls pages, extracts structured data. Feed any URL to Claude. | [github.com/mendableai/firecrawl](https://github.com/mendableai/firecrawl) |
| Playwright | Browser automation. Navigate, screenshot, click, fill forms. Claude controls an actual browser. | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) |
| Stitch | Design system management. Create and apply design systems to your projects. | [github.com/google/stitch](https://github.com/google/stitch) |

### Plugins

| Tool | What It Does | Link |
|------|-------------|------|
| Superpowers / GSD | Full project workflow. Plan phases, spawn subagents, execute plans, verify work. The backbone. | [github.com/superpowers-dev/superpowers](https://github.com/superpowers-dev/superpowers) |
| Claude Mem | Persistent memory across sessions. Search past work, recall decisions, timeline reports. | [github.com/anthropics/claude-mem](https://github.com/anthropics/claude-mem) |
| Claude HUD | Status line showing token usage, model, session info. Know what's happening at a glance. | [github.com/claude-hud/claude-hud](https://github.com/claude-hud/claude-hud) |
| CLI Anything | Run any CLI tool as an MCP server. Bridge between Claude and your existing tools. | [github.com/thedotmack/cli-anything](https://github.com/thedotmack/cli-anything) |

### Also Covered in the Guide

- CLAUDE.md project file setup (how to give Claude context about your repo)
- Settings.json configuration (permissions, model selection, hooks)
- Keybindings and shortcuts
- How to use /slash commands effectively
- WSL setup tips for Windows users
- How to chain agents for complex multi step tasks
