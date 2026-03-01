import { Router, Request, Response } from 'express';
import { AIAgentService } from '../services/AIAgentService';

const router = Router();

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

export default router;
