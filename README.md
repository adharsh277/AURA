# 🤖 AURA-T - Autonomous Stable Treasury Agent

<div align="center">

![AURA Logo](https://img.shields.io/badge/AURA--T-Stable%20Treasury%20Agent-00D1FF?style=for-the-badge&logo=robot&logoColor=white)

**Autonomous Stable Treasury Agent for USD₮ & XAU₮**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)

</div>

---

## 🚀 Overview

AURA-T is an autonomous stable treasury agent managing USD₮ and XAU₮ capital.
It continuously observes market conditions, evaluates risk-adjusted yield opportunities, dynamically allocates capital between yield, hedge, and safe modes, and logs decisions on-chain for transparency.
The agent maintains a stable reserve threshold, enforces capital preservation rules, and adapts strategies without manual intervention.
Designed for DAO treasuries, startups, and on-chain capital managers.

### ✨ Key Features

- **🤖 Autonomous Agent Loop** - Observe → Evaluate → Plan → Execute → Log → Adapt
- **💰 Stable Treasury Accounting** - USD₮ reserve, XAU₮ hedge, yield deployment buckets
- **🧠 Economic Explainability** - Expected return, capital efficiency, drawdown visibility
- **🛡️ Safety Guardrails** - Never exceed treasury capital; deterministic fallback to safe allocation
- **🔐 Wallet Architecture** - Optional user wallet + primary WDK-style agent wallet flow
- **🧾 Transparent Decision Proofs** - SHA-256 decision hashes surfaced in the UI

## ✅ What We Updated Till Now

### Backend (Implemented)
- Added AURA-T core architecture in `backend/src/core/`:
	- `agentLoop.ts`
	- `strategyEngine.ts`
	- `economicEngine.ts` (includes `economicReport`)
	- `riskEngine.ts`
	- `memoryStore.ts`
	- `safetyGuard.ts`
	- `executionEngine.ts`
	- `onchainLogger.ts`
- Wired demo flow from backend startup and verified execution output with:
	- observation
	- strategy selection
	- allocation
	- economic report
	- on-chain decision hash
	- mode switch across runs

### Treasury API (Implemented)
- Added autonomous treasury routes:
	- `POST /api/agent/treasury/create`
	- `GET /api/agent/treasury/status`
- Treasury payload now includes:
	- USD₮ reserve
	- XAU₮ hedge
	- yield deployed
	- mode (`SAFE` / `YIELD` / `HEDGE`)
	- expected return %
	- worst-case drawdown %
	- worst-case exposure %
	- last decision hash

### Frontend (Implemented)
- Reframed dashboard to treasury-first language:
	- `Portfolio Overview` → `Treasury Overview`
	- `Your Assets` → `Treasury Allocation`
- Removed HashPack from wallet connect UI; MetaMask is primary and Xverse optional.
- Added same-origin frontend API proxies for treasury create/status to avoid browser `localhost:3001` fetch issues.
- Updated AI panel with:
	- Mode
	- Last Decision Hash
	- Expected Return
	- Worst Case Exposure
- Updated landing and metadata branding to `AURA-T` treasury positioning.

### Current Implementation Status
- **Treasury accounting is currently simulated for MVP demo purposes.**
- Decision logging uses cryptographic hashing and is displayed live.
- Live USD₮/XAU₮ on-chain settlement is **not** fully wired yet in this MVP.

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

### Agent Core
- **AURA-T Core Engines** - Risk, strategy, economic planning, execution, memory, safety, logging

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
│   │   ├── core/            # AURA-T autonomous treasury core
│   │   │   ├── agentLoop.ts
│   │   │   ├── strategyEngine.ts
│   │   │   ├── economicEngine.ts
│   │   │   ├── riskEngine.ts
│   │   │   ├── memoryStore.ts
│   │   │   ├── safetyGuard.ts
│   │   │   ├── executionEngine.ts
│   │   │   └── onchainLogger.ts
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
- MetaMask (for optional user wallet connect in demo)

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

### Step 1: Connect User Wallet (Optional)
User connects MetaMask for deposit/withdraw authorization.

### Step 2: Create Autonomous Treasury
User clicks `Create Autonomous Treasury`. System provisions an agent wallet and funds treasury lanes.

### Step 3: Agent Takes Control
Agent runs the loop: Observe → Evaluate → Plan → Execute → Log → Adapt.

### Step 4: Continuous Management
Agent continuously adapts reserve, hedge, and yield allocation with transparent decision proofs.

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
| POST | `/api/agent/treasury/create` | Create autonomous treasury |
| GET | `/api/agent/treasury/status` | Get autonomous treasury state |

### Notes
- Legacy routes may still exist in codebase, but AURA-T demo flow centers on `/api/agent/treasury/*`.

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

## 🏆 Why AURA-T Is Competitive

✅ **Autonomy** - End-to-end treasury loop with adaptive mode switching

✅ **Economic Soundness** - Reserve logic + capital efficiency + drawdown framing

✅ **Transparency** - Decision hash logging and explainable outputs

✅ **Real-World Use Case** - DAO/startup treasury operations for stable capital

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Hedera Team for the amazing blockchain
- OpenAI for AI capabilities
- The open-source community

---

<div align="center">

**AURA-T: Autonomous Stable Treasury Agent for USD₮ & XAU₮**

</div>
