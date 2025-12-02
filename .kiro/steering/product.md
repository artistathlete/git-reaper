# Git Reaper Product Overview

Git Reaper is a web application that identifies and visualizes "dead branches" (merged but not deleted) in GitHub repositories. It provides a hauntingly beautiful graveyard-themed interface for branch cleanup.

## Core Features

- **Fast GitHub API analysis** - No cloning required, analyzes branches via GitHub API
- **Real-time progress streaming** - Server-Sent Events show live analysis status
- **Privacy-first** - No data storage, read-only access, optional GitHub token
- **Beautiful UI** - Moonlit graveyard theme with animations (stars, fog, tombstones)
- **Zero setup** - Works immediately with any public GitHub repository

## User Flow

1. User pastes GitHub repository URL
2. Click "Reap" to start analysis
3. Watch real-time progress as branches are checked
4. View dead branches as tombstone cards in a graveyard
5. Click tombstones to view commits on GitHub
6. Use provided git commands to clean up branches

## Design Philosophy

Make branch cleanup feel like an adventure rather than a chore. Every interaction should be atmospheric, smooth, and delightful while remaining functional and fast.
