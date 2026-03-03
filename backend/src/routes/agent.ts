import { Router, Request, Response } from 'express';
import { AIAgentService } from '../services/AIAgentService';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

const router = Router();

type TreasuryStatus = 'inactive' | 'active';

interface AutonomousTreasury {
  treasuryId: string;
  createdAt: string;
  status: TreasuryStatus;
  userWalletAccountId: string | null;
  agentWallet: {
    type: 'WDK_AGENT_WALLET';
    walletId: string;
    walletAddress: string;
  };
  capital: {
    asset: 'USDT';
    deposited: number;
    usdtReserve: number;
    xautHedge: number;
    yieldDeployed: number;
  };
  autonomyState: {
    mode: 'Observe-Evaluate-Plan-Execute-Log-Adapt';
    isAutonomous: boolean;
  };
  analytics: {
    mode: 'SAFE' | 'YIELD' | 'HEDGE';
    stableReservePercent: number;
    deployedCapitalPercent: number;
    expectedReturnPercent: number;
    worstCaseDrawdownPercent: number;
    capitalEfficiencyPercent: number;
    lastDecisionHash: string;
    worstCaseExposurePercent: number;
  };
}

let activeTreasury: AutonomousTreasury | null = null;

/**
 * Get AI agent status
 * GET /api/agent/status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    const status = aiAgent.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting agent status:', error);
    res.status(500).json({ error: 'Failed to get agent status' });
  }
});

/**
 * Start AI agent
 * POST /api/agent/start
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    aiAgent.start();
    res.json({ message: 'AI Agent started', status: aiAgent.getStatus() });
  } catch (error) {
    console.error('Error starting agent:', error);
    res.status(500).json({ error: 'Failed to start agent' });
  }
});

/**
 * Stop AI agent
 * POST /api/agent/stop
 */
router.post('/stop', async (req: Request, res: Response) => {
  try {
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    aiAgent.stop();
    res.json({ message: 'AI Agent stopped', status: aiAgent.getStatus() });
  } catch (error) {
    console.error('Error stopping agent:', error);
    res.status(500).json({ error: 'Failed to stop agent' });
  }
});

/**
 * Trigger manual portfolio scan
 * POST /api/agent/scan
 */
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.body;
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    const analysis = await aiAgent.performScan(accountId);
    res.json(analysis);
  } catch (error) {
    console.error('Error performing scan:', error);
    res.status(500).json({ error: 'Failed to perform scan' });
  }
});

/**
 * Get all AI decisions
 * GET /api/agent/decisions
 */
router.get('/decisions', async (req: Request, res: Response) => {
  try {
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    const decisions = aiAgent.getDecisions();
    res.json({ decisions });
  } catch (error) {
    console.error('Error getting decisions:', error);
    res.status(500).json({ error: 'Failed to get decisions' });
  }
});

/**
 * Get specific decision
 * GET /api/agent/decisions/:id
 */
router.get('/decisions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    const decision = aiAgent.getDecision(id);
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    
    res.json(decision);
  } catch (error) {
    console.error('Error getting decision:', error);
    res.status(500).json({ error: 'Failed to get decision' });
  }
});

/**
 * Execute a decision
 * POST /api/agent/decisions/:id/execute
 */
router.post('/decisions/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    const success = await aiAgent.executeDecision(id);
    
    if (success) {
      res.json({ message: 'Decision executed successfully', decision: aiAgent.getDecision(id) });
    } else {
      res.status(500).json({ error: 'Failed to execute decision' });
    }
  } catch (error) {
    console.error('Error executing decision:', error);
    res.status(500).json({ error: 'Failed to execute decision' });
  }
});

/**
 * Get AI explainability for current recommendation
 * GET /api/agent/explain
 */
router.get('/explain', async (req: Request, res: Response) => {
  try {
    const aiAgent: AIAgentService = req.app.get('aiAgent');
    const decisions = aiAgent.getDecisions();
    const latestDecision = decisions[decisions.length - 1];

    if (!latestDecision) {
      return res.json({
        message: 'No active recommendations',
        recommendation: null
      });
    }

    res.json({
      recommendation: latestDecision.action,
      reasoning: latestDecision.reasoning,
      riskScore: latestDecision.riskScore,
      confidenceScore: latestDecision.confidenceScore,
      expectedOutcome: latestDecision.expectedOutcome,
      alternatives: [
        { action: 'Hold current positions', risk: 20, confidence: 65 },
        { action: 'Swap to USDC', risk: 15, confidence: 45 }
      ]
    });
  } catch (error) {
    console.error('Error getting explanation:', error);
    res.status(500).json({ error: 'Failed to get explanation' });
  }
});

router.post('/treasury/create', async (req: Request, res: Response) => {
  try {
    const { userWalletAccountId, depositAmount } = req.body as {
      userWalletAccountId?: string;
      depositAmount?: number;
    };

    const normalizedDeposit = typeof depositAmount === 'number' ? depositAmount : 10000;
    if (!Number.isFinite(normalizedDeposit) || normalizedDeposit <= 0) {
      return res.status(400).json({ error: 'depositAmount must be a positive number' });
    }

    const treasuryId = `treasury-${uuidv4().slice(0, 8)}`;
    const walletId = `wdk-${uuidv4().slice(0, 12)}`;
    const walletAddress = `wdk-agent-${uuidv4().replace(/-/g, '').slice(0, 24)}`;
    const usdtReserve = normalizedDeposit * 0.3;
    const xautHedge = normalizedDeposit * 0.25;
    const yieldDeployed = normalizedDeposit - usdtReserve - xautHedge;
    const lastDecisionHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ treasuryId, normalizedDeposit, createdAt: Date.now() }))
      .digest('hex');

    activeTreasury = {
      treasuryId,
      createdAt: new Date().toISOString(),
      status: 'active',
      userWalletAccountId: userWalletAccountId || null,
      agentWallet: {
        type: 'WDK_AGENT_WALLET',
        walletId,
        walletAddress,
      },
      capital: {
        asset: 'USDT',
        deposited: normalizedDeposit,
        usdtReserve,
        xautHedge,
        yieldDeployed,
      },
      autonomyState: {
        mode: 'Observe-Evaluate-Plan-Execute-Log-Adapt',
        isAutonomous: true,
      },
      analytics: {
        mode: 'YIELD',
        stableReservePercent: 30,
        deployedCapitalPercent: 70,
        expectedReturnPercent: 7.2,
        worstCaseDrawdownPercent: -6,
        capitalEfficiencyPercent: 7.2,
        lastDecisionHash,
        worstCaseExposurePercent: -8,
      },
    };

    const aiAgent: AIAgentService = req.app.get('aiAgent');
    if (!aiAgent.getStatus().isActive) {
      aiAgent.start();
    }

    res.json({
      message: 'Autonomous treasury created. Agent wallet is now managing capital.',
      treasury: activeTreasury,
    });
  } catch (error) {
    console.error('Error creating autonomous treasury:', error);
    res.status(500).json({ error: 'Failed to create autonomous treasury' });
  }
});

router.get('/treasury/status', async (_req: Request, res: Response) => {
  try {
    res.json({
      treasury: activeTreasury,
    });
  } catch (error) {
    console.error('Error getting treasury status:', error);
    res.status(500).json({ error: 'Failed to get treasury status' });
  }
});

export default router;
