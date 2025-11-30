# 🪦 Git Reaper

**Find and clean up dead branches in your GitHub repositories with a hauntingly beautiful interface.**

![Git Reaper - Graveyard Theme](https://img.shields.io/badge/theme-graveyard-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## 🌙 Why Git Reaper?

Every repository has them - **dead branches** that were merged months ago but never deleted. They clutter your branch list, confuse new contributors, and make it harder to find active work.

**Git Reaper** solves this with:
- ⚡ **Lightning-fast analysis** using GitHub's API (no cloning needed!)
- 🎯 **Zero setup** - works immediately, no installation required
- 🔒 **100% private** - nothing is stored, tracked, or logged
- 🎨 **Beautiful UI** - moonlit graveyard theme with smooth animations
- 📊 **Real-time progress** - watch as branches are analyzed live
- 🆓 **Free to use** - 60 requests/hour without a token, unlimited with your own

## ✨ Features

### 🔍 Smart Branch Detection
Automatically identifies branches that have been:
- Fully merged into your main branch
- Left undeleted (the "dead" branches)
- Sorted by age for easy cleanup prioritization

### 📈 Live Progress Tracking
See exactly what's happening:
- "Checking branch 15 of 47..."
- "Found 8 merged branches so far"
- Real-time progress bar

### 🎭 Atmospheric Design
- Twinkling stars in the night sky
- Glowing, pulsing moon
- Animated fog effects
- Tombstone cards with hover animations
- Smooth transitions and depth effects

### 🔐 Privacy First
- **No data storage** - everything happens in real-time
- **No tracking** - your tokens are never saved
- **Read-only access** - we never modify your repos
- **Open source** - see exactly what we do

### 📊 Detailed Stats
After analysis, see:
- Total dead branches found
- Average days since last commit
- Age of the oldest dead branch
- Cleanup suggestions and git commands

## 🚀 Quick Start

1. Visit the app (or run locally)
2. Paste any GitHub repository URL
3. Click "Reap" and watch the magic happen
4. Review the dead branches in the graveyard
5. Use the provided git commands to clean up

**That's it!** No signup, no configuration, no hassle.

## 🎯 Try These Examples

Click any of these popular repos to see Git Reaper in action:
- React (facebook/react)
- VS Code (microsoft/vscode)
- Next.js (vercel/next.js)
- Node.js (nodejs/node)
- TensorFlow (tensorflow/tensorflow)
- Linux Kernel (torvalds/linux)

## 🔑 Optional: GitHub Token

**You don't need a token to use Git Reaper!** 

But if you want unlimited access:
- Without token: 60 requests/hour (GitHub's free tier)
- With token: 5000 requests/hour

[Get a free token in 30 seconds →](https://github.com/settings/tokens)

Just create a "classic" token with **no scopes selected** - that's it!

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **GitHub API** - Fast, efficient branch analysis
- **Server-Sent Events** - Real-time progress streaming
- **Vitest** - Testing framework

## 💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/artistathlete/git-reaper.git
cd git-reaper

# Install dependencies
npm install

# (Optional) Add your GitHub token
echo "GITHUB_TOKEN=your_token_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start reaping!

## 🧪 Run Tests

```bash
npm test
```

## 🎨 Design Philosophy

Git Reaper isn't just a tool - it's an **experience**. We wanted to make branch cleanup feel less like a chore and more like an adventure through a moonlit graveyard. Every animation, every shadow, every glow is carefully crafted to create an atmosphere that's both functional and delightful.

## 🤝 Contributing

Found a bug? Have an idea? Contributions are welcome!

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

MIT License - feel free to use this in your own projects!

## 🌟 Show Your Support

If Git Reaper helped you clean up your repos, give it a ⭐️ on GitHub!

---

**Built with 🖤 by developers who care about clean repositories**

*"Not all who wander are lost, but all merged branches should be deleted."*
