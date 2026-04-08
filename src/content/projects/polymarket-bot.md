---
title: "Polymarket Prediction Bot"
description: "Automated prediction market trading bot that uses Claude AI to screen bets, analyze probabilities, and execute trades on Polymarket."
tags: ["Trading", "Automation", "AI", "Python"]
priceTier: "paid"
status: "live"
tools: ["Claude API", "Polymarket API", "Python", "VPS", "Clob Client"]
publishedAt: 2026-01-15
---

Monitors Polymarket prediction markets around the clock. Claude AI screens events for edge, calculates position sizes with Kelly criterion, and executes via the CLOB API. Backtested against 404M historical trades. Runs on a VPS with systemd. NO-biased strategy, side-aware sizing, 25+ stock tickers tracked. The starter kit includes architecture guide, sanitized boilerplate, and backtesting findings.
