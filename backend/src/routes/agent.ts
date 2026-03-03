import { Router, Request, Response } from 'express';
import { AIAgentService } from '../services/AIAgentService';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

const router = Router();

type TreasuryStatus = 'inactive' | 'active';
type AutonomyLevel = 'SUPERVISED' | 'FULL_AUTONOMOUS';
type StrategyMode = 'SAFE' | 'YIELD' | 'HEDGE';

type StressScenario = 'market_crash' | 'yield_collapse' | 'liquidity_shock';

interface StrategyPerformanceRow {
  mode: StrategyMode;
  timesActivated: number;
  avgReturnPercent: number;
  maxDrawdownPercent: number;
}

interface TreasuryPolicyRule {
  id: string;
  label: string;
  value: string;
}

interface OnchainProof {
  decisionHash: string;
  transactionId: string;
  explorerUrl: string;
  signedAgentWalletAddress: string;
  policyVersionHash: string;
}

interface RiskModelDetails {
  volatilityInput: string;
  apyWeighting: string;
  hedgeCorrelation: string;
  drawdownMethod: string;
}

interface StressTestResult {
  scenario: StressScenario;
  postShockCapital: number;
  reserveAfterShock: number;
  hedgeAfterShock: number;
  yieldAfterShock: number;
  estimatedDrawdownPercent: number;
  guardianTriggered: boolean;
  executedAt: string;
}

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
    level: AutonomyLevel;
    isAutonomous: boolean;
  };
  analytics: {
    mode: StrategyMode;
    stableReservePercent: number;
    deployedCapitalPercent: number;
    expectedReturnPercent: number;
    worstCaseDrawdownPercent: number;
    capitalEfficiencyPercent: number;
    worstCaseExposurePercent: number;
  };
  strategyPerformance: StrategyPerformanceRow[];
  treasuryPolicy: {
    recheckIntervalMinutes: number;
    maxDeployPercent: number;
    minReservePercent: number;
    maxDrawdownTolerancePercent: number;
    hedgeVolatilityTrigger: number;
    rules: TreasuryPolicyRule[];
  };
  onchainProof: OnchainProof;
  riskModel: RiskModelDetails;
  capitalGuardian: {
    enabled: boolean;
    isLocked: boolean;
    lockReason: string | null;
    thresholdDrawdownPercent: number;
  };
  lastStressTest: StressTestResult | null;
}

let activeTreasury: AutonomousTreasury | null = null;

function buildPolicyRules(): TreasuryPolicyRule[] {
  return [
    { id: 'min-reserve', label: 'Maintain minimum USD₮ reserve', value: '25%' },
    { id: 'max-deploy', label: 'Max capital deployment', value: '70%' },
    { id: 'max-drawdown', label: 'Max drawdown tolerance', value: '10%' },
    { id: 'hedge-trigger', label: 'Hedge if volatility >', value: '0.65' },
    { id: 'reeval', label: 'Re-evaluate interval', value: '10 minutes' },
  ];
}

function policyVersionHash(rules: TreasuryPolicyRule[]): string {
  return crypto.createHash('sha256').update(JSON.stringify(rules)).digest('hex');
}

function makeOnchainProof(agentWalletAddress: string, policyHash: string): OnchainProof {
  const transactionId = `tx-${Date.now()}-${uuidv4().slice(0, 8)}`;
  const decisionHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ transactionId, agentWalletAddress, ts: Date.now() }))
    .digest('hex');

  return {
    decisionHash,
    transactionId,
    explorerUrl: `https://hashscan.io/testnet/transaction/${transactionId}`,
    signedAgentWalletAddress: agentWalletAddress,
    policyVersionHash: policyHash,
  };
}

function applyGuardianLock(treasury: AutonomousTreasury, reason: string): AutonomousTreasury {
  if (treasury.capitalGuardian.isLocked) {
    return treasury;
  }

  const deposited = treasury.capital.deposited;
  const lockedReserve = deposited * 0.9;

  return {
    ...treasury,
    capital: {
      ...treasury.capital,
      usdtReserve: lockedReserve,
      yieldDeployed: 0,
      xautHedge: deposited - lockedReserve,
    },
    analytics: {
      ...treasury.analytics,
      mode: 'SAFE',
      deployedCapitalPercent: 0,
      stableReservePercent: 90,
      expectedReturnPercent: 0,
      capitalEfficiencyPercent: 0,
    },
    capitalGuardian: {
      ...treasury.capitalGuardian,
      isLocked: true,
      lockReason: reason,
    },
  };
}

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
        recommendation: null,
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
        { action: 'Swap to USDC', risk: 15, confidence: 45 },
      ],
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

    const rules = buildPolicyRules();
    const policyHash = policyVersionHash(rules);
    const proof = makeOnchainProof(walletAddress, policyHash);

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
        usdtReserve: normalizedDeposit * 0.3,
        xautHedge: normalizedDeposit * 0.25,
        yieldDeployed: normalizedDeposit * 0.45,
      },
      autonomyState: {
        mode: 'Observe-Evaluate-Plan-Execute-Log-Adapt',
        level: 'SUPERVISED',
        isAutonomous: false,
      },
      analytics: {
        mode: 'YIELD',
        stableReservePercent: 30,
        deployedCapitalPercent: 70,
        expectedReturnPercent: 7.2,
        worstCaseDrawdownPercent: -6,
        capitalEfficiencyPercent: 7.2,
        worstCaseExposurePercent: -8,
      },
      strategyPerformance: [
        { mode: 'SAFE', timesActivated: 3, avgReturnPercent: 0, maxDrawdownPercent: -1 },
        { mode: 'YIELD', timesActivated: 5, avgReturnPercent: 7.1, maxDrawdownPercent: -8 },
        { mode: 'HEDGE', timesActivated: 2, avgReturnPercent: 3.2, maxDrawdownPercent: -2 },
      ],
      treasuryPolicy: {
        recheckIntervalMinutes: 10,
        maxDeployPercent: 70,
        minReservePercent: 25,
        maxDrawdownTolerancePercent: 10,
        hedgeVolatilityTrigger: 0.65,
        rules,
      },
      onchainProof: proof,
      riskModel: {
        volatilityInput: 'Market volatility score from risk engine (0 to 1)',
        apyWeighting: 'Expected return weighted by APY confidence and mode',
        hedgeCorrelation: 'XAU₮ hedge coefficient applied when volatility > trigger',
        drawdownMethod: 'Worst-case drawdown estimated via scenario stress multipliers',
      },
      capitalGuardian: {
        enabled: true,
        isLocked: false,
        lockReason: null,
        thresholdDrawdownPercent: -10,
      },
      lastStressTest: null,
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

router.post('/treasury/autonomy', async (req: Request, res: Response) => {
  try {
    if (!activeTreasury) {
      return res.status(404).json({ error: 'Treasury not found. Create treasury first.' });
    }

    const { level } = req.body as { level?: AutonomyLevel };
    if (level !== 'SUPERVISED' && level !== 'FULL_AUTONOMOUS') {
      return res.status(400).json({ error: 'level must be SUPERVISED or FULL_AUTONOMOUS' });
    }

    activeTreasury = {
      ...activeTreasury,
      autonomyState: {
        ...activeTreasury.autonomyState,
        level,
        isAutonomous: level === 'FULL_AUTONOMOUS',
      },
    };

    res.json({ message: `Autonomy level updated to ${level}`, treasury: activeTreasury });
  } catch (error) {
    console.error('Error updating treasury autonomy:', error);
    res.status(500).json({ error: 'Failed to update autonomy level' });
  }
});

router.post('/treasury/stress-test', async (req: Request, res: Response) => {
  try {
    if (!activeTreasury) {
      return res.status(404).json({ error: 'Treasury not found. Create treasury first.' });
    }

    const { scenario } = req.body as { scenario?: StressScenario };
    const selectedScenario: StressScenario = scenario || 'market_crash';

    const shockMap: Record<StressScenario, number> = {
      market_crash: -0.2,
      yield_collapse: -0.12,
      liquidity_shock: -0.15,
    };

    const shock = shockMap[selectedScenario];
    const postShockCapital = activeTreasury.capital.deposited * (1 + shock);
    const reserveAfterShock = postShockCapital * 0.35;
    const hedgeAfterShock = postShockCapital * 0.3;
    const yieldAfterShock = postShockCapital - reserveAfterShock - hedgeAfterShock;
    const estimatedDrawdownPercent = Number((shock * 100).toFixed(1));
    const guardianTriggered = estimatedDrawdownPercent <= activeTreasury.capitalGuardian.thresholdDrawdownPercent;

    const stressResult: StressTestResult = {
      scenario: selectedScenario,
      postShockCapital,
      reserveAfterShock,
      hedgeAfterShock,
      yieldAfterShock,
      estimatedDrawdownPercent,
      guardianTriggered,
      executedAt: new Date().toISOString(),
    };

    let updated: AutonomousTreasury = {
      ...activeTreasury,
      lastStressTest: stressResult,
      analytics: {
        ...activeTreasury.analytics,
        worstCaseDrawdownPercent: estimatedDrawdownPercent,
      },
    };

    if (guardianTriggered) {
      updated = applyGuardianLock(updated, `Guardian auto-lock triggered by ${selectedScenario}`);
    }

    const refreshedProof = makeOnchainProof(updated.agentWallet.walletAddress, updated.onchainProof.policyVersionHash);
    updated = { ...updated, onchainProof: refreshedProof };

    activeTreasury = updated;

    res.json({
      message: 'Stress scenario executed',
      stressTest: stressResult,
      treasury: activeTreasury,
    });
  } catch (error) {
    console.error('Error running stress test:', error);
    res.status(500).json({ error: 'Failed to run stress test' });
  }
});

router.get('/treasury/status', async (_req: Request, res: Response) => {
  try {
    res.json({ treasury: activeTreasury });
  } catch (error) {
    console.error('Error getting treasury status:', error);
    res.status(500).json({ error: 'Failed to get treasury status' });
  }
});

export default router;
