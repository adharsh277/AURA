# 🤖 AURA - Autonomous Unified Resource Agent

<div align="center">

![AURA Logo](https://img.shields.io/badge/AURA-AI%20Portfolio%20Agent-00D1FF?style=for-the-badge&logo=robot&logoColor=white)

**AI agent that autonomously manages, optimizes, and protects your crypto portfolio on Hedera.**

[![Hedera](https://img.shields.io/badge/Built%20on-Hedera-00D1FF?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA)](https://hedera.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)

</div>

---

## 🚀 Overview

AURA is a next-generation AI-powered portfolio management system built on Hedera. It combines the power of artificial intelligence with the speed and security of Hedera Hashgraph to provide autonomous, intelligent management of your crypto assets.

### ✨ Key Features

- **🤖 Autonomous AI Agent** - Makes intelligent decisions and executes Hedera transactions automatically
- **📊 Smart Portfolio Optimization** - Maximizes yield while minimizing risk
- **📈 Real-time Monitoring Dashboard** - Live portfolio value, AI decisions, and performance metrics
- **🧠 AI Explainability Panel** - Understand why AI made each decision with risk and confidence scores
- **🛡️ Risk Management** - Automatic stop-loss, portfolio protection, and risk assessment
- **⚡ Hedera Integration** - Fast, secure, and low-cost transactions

## 🎨 Screenshots

The dashboard features a futuristic cyberpunk design with:
- Glassmorphism cards with neon borders
- Animated particle background
- Pulsing AI orb visualization
- Live charts and metrics
- Neural network patterns

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Three.js / React Three Fiber** - 3D particle effects
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket** - Real-time communication
- **OpenAI API** - AI decision making

### Blockchain
- **Hedera SDK** - Blockchain integration
- **Hedera Smart Contracts** - Portfolio management
- **Hedera Token Service (HTS)** - Token operations
- **Hedera Consensus Service (HCS)** - Action logging

## 📁 Project Structure

```
AURA/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── particles/   # Particle effects
│   │   │   ├── ui/          # UI components
│   │   │   └── wallet/      # Wallet connection
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── types/           # TypeScript types
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                  # Node.js backend server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   │   ├── agent.ts     # AI agent routes
│   │   │   ├── portfolio.ts # Portfolio routes
│   │   │   └── hedera.ts    # Hedera routes
│   │   ├── services/        # Business logic
│   │   │   ├── AIAgentService.ts
│   │   │   ├── HederaService.ts
│   │   │   ├── PriceFeedService.ts
│   │   │   ├── RiskAnalyzer.ts
│   │   │   └── WebSocketService.ts
│   │   └── index.ts         # Server entry point
│   ├── contracts/           # Solidity smart contracts
│   │   └── AURAPortfolioManager.sol
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Hedera Testnet Account (get one at [portal.hedera.com](https://portal.hedera.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/adharsh277/AURA.git
cd AURA
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Configure Environment Variables**
```bash
# Backend .env
cp .env.example .env
# Edit .env with your Hedera credentials
```

5. **Start Development Servers**

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (new terminal):**
```bash
cd frontend
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## 🔧 Configuration

### Backend Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Hedera
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.XXXXX
HEDERA_PRIVATE_KEY=your-private-key

# AI
OPENAI_API_KEY=your-api-key

# Risk Management
MAX_POSITION_SIZE=0.25
MAX_PORTFOLIO_RISK=0.5
STOP_LOSS_PERCENTAGE=0.1
```

## 🤖 How It Works

### Step 1: Connect Wallet
User connects their Hedera wallet (HashPack/MetaMask Snap/WalletConnect). AI reads balances, tokens, and positions.

### Step 2: AI Analyzes Portfolio
AI agent evaluates risk level, market conditions, yield opportunities, and volatility using price feeds and Hedera network data.

### Step 3: AI Suggests & Executes Strategy
AI decides optimal actions (invest, stake, move funds, reduce exposure) and executes automatically using Hedera smart contracts.

### Step 4: Continuous Management
Agent runs continuously, monitoring market conditions, adapting strategy, and protecting funds.

## 📡 API Endpoints

### Agent Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agent/status` | Get AI agent status |
| POST | `/api/agent/start` | Start AI agent |
| POST | `/api/agent/stop` | Stop AI agent |
| POST | `/api/agent/scan` | Trigger portfolio scan |
| GET | `/api/agent/decisions` | Get all AI decisions |
| GET | `/api/agent/explain` | Get AI explainability |

### Portfolio Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/:accountId` | Get portfolio overview |
| GET | `/api/portfolio/:accountId/risk` | Get risk analysis |
| GET | `/api/portfolio/:accountId/history` | Get portfolio history |

### Hedera Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hedera/prices` | Get token prices |
| GET | `/api/hedera/market` | Get market data |
| POST | `/api/hedera/transfer/hbar` | Transfer HBAR |
| POST | `/api/hedera/transfer/token` | Transfer tokens |

## 🎯 Features in Detail

### AI Explainability Panel
- Shows why AI made each decision
- Risk score (0-100)
- Confidence score (0-100)
- Alternative actions considered
- Expected outcomes

### Risk Management
- Real-time risk assessment
- Automatic stop-loss triggers
- Portfolio diversification analysis
- Value at Risk (VaR) calculations

### Smart Strategies
- **Yield Optimization**: Find best staking/LP opportunities
- **Rebalancing**: Maintain target allocations
- **Protection**: Enable stop-loss on volatile assets
- **DCA**: Dollar-cost averaging automation

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#00D1FF` | Primary actions, highlights |
| Deep Blue | `#0A192F` | Secondary backgrounds |
| Neon Accent | `#00FFA3` | Success states, positive |
| Background Dark | `#020617` | Main background |
| Card Background | `#0F172A` | Card surfaces |

### Animations
- Floating particles (Three.js)
- Pulsing AI orb indicator
- Glow effects on hover
- Neural network patterns
- Glassmorphism transitions

## 🏆 Why AURA Wins

✅ **Innovation** - First autonomous AI portfolio manager on Hedera

✅ **Execution** - Clean code, modern stack, production-ready

✅ **Hedera Integration** - Deep integration with HTS, HCS, Smart Contracts

✅ **Real-world Value** - Solves real problems for crypto investors

✅ **AI Agent Behavior** - Truly autonomous decision-making

✅ **Demo Appeal** - Stunning visuals, live functionality

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Hedera Team for the amazing blockchain
- OpenAI for AI capabilities
- The open-source community

---

<div align="center">

**Built with 💙 for the Hedera Ecosystem**

[Website](https://aura.app) • [Documentation](https://docs.aura.app) • [Twitter](https://twitter.com/aurahedera)

</div>
AURA : Autonomous Unified Resource Agent AI agent that autonomously manages, optimizes, and protects your crypto portfolio on Hedera.
