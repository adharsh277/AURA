import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';

// Load environment variables
dotenv.config();

// Import routes
import portfolioRoutes from './routes/portfolio';
import agentRoutes from './routes/agent';
import hederaRoutes from './routes/hedera';

// Import services
import { AIAgentService } from './services/AIAgentService';
import { WebSocketService } from './services/WebSocketService';
import { runAgent } from './core/agentLoop';
import { AgentState } from './core/memoryStore';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://aura.app' 
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Initialize WebSocket service
const wsService = new WebSocketService(wss);

// Initialize AI Agent
const aiAgent = new AIAgentService(wsService);

// Make services available to routes
app.set('aiAgent', aiAgent);
app.set('wsService', wsService);

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/hedera', hederaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    agent: aiAgent.getStatus()
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

async function runAURATDemo(): Promise<void> {
  const state: AgentState = {
    capital: 10000,
    memory: {
      lastObservation: null,
      lastStrategy: null,
      performance: [],
    },
  };

  console.log('\n=== AURA-T DEMO: Autonomous Stable Treasury Agent ===');
  console.log('Starting capital: 10000 USD₮\n');

  await runAgent(state);
  const firstMode = state.memory.lastStrategy?.mode;

  let switched = false;
  for (let attempt = 1; attempt <= 20; attempt++) {
    await runAgent(state);
    const currentMode = state.memory.lastStrategy?.mode;
    if (firstMode && currentMode && currentMode !== firstMode) {
      console.log(`Mode switch detected: ${firstMode} → ${currentMode}`);
      switched = true;
      break;
    }
  }

  if (!switched) {
    console.log('Mode switch not observed within retry limit.');
  }
}

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║     🤖 AURA Backend Server Started            ║
  ║                                               ║
  ║     Port: ${PORT}                              ║
  ║     Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║     AI Agent: Active                          ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
  
  // Start AI Agent
  aiAgent.start();

  runAURATDemo().catch((error: Error) => {
    console.error('AURA-T demo failed:', error.message);
  });
});

export default app;
