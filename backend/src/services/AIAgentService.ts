import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import { WebSocketService } from './WebSocketService';
import { hederaService } from './HederaService';
import { PriceFeedService } from './PriceFeedService';
import { RiskAnalyzer } from './RiskAnalyzer';

export interface Decision {
  id: string;
  type: 'stake' | 'swap' | 'protect' | 'rebalance' | 'hold';
  action: string;
  reasoning: string[];
  riskScore: number;
  confidenceScore: number;
  expectedOutcome: string;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  txHash?: string;
}

export interface AgentStatus {
  isActive: boolean;
  lastScan: Date | null;
  totalDecisions: number;
  activeStrategies: string[];
  currentRisk: number;
}

export interface PortfolioAnalysis {
  totalValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  diversificationScore: number;
  yieldOpportunities: number;
  recommendations: Decision[];
}

export class AIAgentService {
  private isActive: boolean = false;
  private wsService: WebSocketService;
  private decisions: Decision[] = [];
  private lastScan: Date | null = null;
  private cronJob: cron.ScheduledTask | null = null;
  private priceFeed: PriceFeedService;
  private riskAnalyzer: RiskAnalyzer;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    this.priceFeed = new PriceFeedService();
    this.riskAnalyzer = new RiskAnalyzer();
  }

  /**
   * Start the AI agent
   */
  start(): void {
    this.isActive = true;
    console.log('🤖 AI Agent started');

    // Run initial scan
    this.performScan();

    // Schedule periodic scans
    const interval = process.env.AGENT_SCAN_INTERVAL_MS || '60000';
    const cronExpression = '*/1 * * * *'; // Every minute
    
    this.cronJob = cron.schedule(cronExpression, () => {
      if (this.isActive) {
        this.performScan();
      }
    });

    this.wsService.broadcast({
      type: 'agent_status',
      data: this.getStatus()
    });
  }

  /**
   * Stop the AI agent
   */
  stop(): void {
    this.isActive = false;
    if (this.cronJob) {
      this.cronJob.stop();
    }
    console.log('🤖 AI Agent stopped');

    this.wsService.broadcast({
      type: 'agent_status',
      data: this.getStatus()
    });
  }

  /**
   * Get agent status
   */
  getStatus(): AgentStatus {
    return {
      isActive: this.isActive,
      lastScan: this.lastScan,
      totalDecisions: this.decisions.length,
      activeStrategies: ['yield_optimization', 'risk_management', 'portfolio_rebalance'],
      currentRisk: this.riskAnalyzer.getCurrentRisk()
    };
  }

  /**
   * Perform portfolio scan and analysis
   */
  async performScan(accountId?: string): Promise<PortfolioAnalysis> {
    console.log('🔍 Performing portfolio scan...');
    this.lastScan = new Date();

    try {
      // Fetch market data
      const marketData = await this.priceFeed.getMarketData();
      
      // Analyze portfolio (mock data for demo)
      const portfolio = await this.analyzePortfolio(accountId || '0.0.123456');
      
      // Generate AI decisions
      const decisions = await this.generateDecisions(portfolio, marketData);
      
      // Broadcast update
      this.wsService.broadcast({
        type: 'scan_complete',
        data: {
          timestamp: this.lastScan,
          analysis: portfolio,
          decisions
        }
      });

      return portfolio;
    } catch (error) {
      console.error('Error during scan:', error);
      throw error;
    }
  }

  /**
   * Analyze portfolio composition and health
   */
  private async analyzePortfolio(accountId: string): Promise<PortfolioAnalysis> {
    // In production, fetch real data from Hedera
    const mockPortfolio = {
      totalValue: 28542.85,
      assets: [
        { symbol: 'HBAR', value: 10000, allocation: 0.35 },
        { symbol: 'USDC', value: 8500, allocation: 0.30 },
        { symbol: 'SAUCE', value: 4285, allocation: 0.15 },
        { symbol: 'HST', value: 2857, allocation: 0.10 },
        { symbol: 'PACK', value: 2900, allocation: 0.10 }
      ]
    };

    const riskLevel = this.riskAnalyzer.assessRisk(mockPortfolio);
    const diversificationScore = this.riskAnalyzer.calculateDiversification(mockPortfolio);
    const yieldOpportunities = await this.priceFeed.getYieldOpportunities();

    return {
      totalValue: mockPortfolio.totalValue,
      riskLevel,
      diversificationScore,
      yieldOpportunities,
      recommendations: []
    };
  }

  /**
   * Generate AI-powered decisions
   */
  private async generateDecisions(
    portfolio: PortfolioAnalysis,
    marketData: any
  ): Promise<Decision[]> {
    const decisions: Decision[] = [];

    // Strategy 1: Yield Optimization
    if (portfolio.yieldOpportunities > 10) {
      decisions.push({
        id: uuidv4(),
        type: 'stake',
        action: 'Stake 3,000 HBAR on SaucerSwap',
        reasoning: [
          'HBAR price has been stable for 72 hours',
          'SaucerSwap APY increased to 12.5%',
          'Current portfolio yield is below target',
          'Low gas fees detected on Hedera network'
        ],
        riskScore: 35,
        confidenceScore: 87,
        expectedOutcome: '+$450 estimated monthly yield',
        timestamp: new Date(),
        status: 'pending'
      });
    }

    // Strategy 2: Risk Management
    if (portfolio.riskLevel === 'high') {
      decisions.push({
        id: uuidv4(),
        type: 'protect',
        action: 'Set stop-loss on volatile assets',
        reasoning: [
          'Market volatility increased 25%',
          'Portfolio risk exceeds threshold',
          'Protecting unrealized gains'
        ],
        riskScore: 20,
        confidenceScore: 92,
        expectedOutcome: 'Protected against 10% downside',
        timestamp: new Date(),
        status: 'pending'
      });
    }

    // Strategy 3: Rebalancing
    if (portfolio.diversificationScore < 0.7) {
      decisions.push({
        id: uuidv4(),
        type: 'rebalance',
        action: 'Rebalance portfolio allocation',
        reasoning: [
          'Current allocation deviates from target',
          'Some positions are over-weighted',
          'Improving risk-adjusted returns'
        ],
        riskScore: 25,
        confidenceScore: 78,
        expectedOutcome: 'Optimized risk/reward ratio',
        timestamp: new Date(),
        status: 'pending'
      });
    }

    this.decisions.push(...decisions);
    return decisions;
  }

  /**
   * Execute a decision
   */
  async executeDecision(decisionId: string): Promise<boolean> {
    const decision = this.decisions.find(d => d.id === decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = 'executing';
    this.wsService.broadcast({
      type: 'decision_executing',
      data: decision
    });

    try {
      // Execute based on decision type
      switch (decision.type) {
        case 'stake':
          // Execute staking transaction
          console.log(`Executing stake: ${decision.action}`);
          break;
        case 'swap':
          // Execute swap transaction
          console.log(`Executing swap: ${decision.action}`);
          break;
        case 'protect':
          // Set up protection (stop-loss)
          console.log(`Setting up protection: ${decision.action}`);
          break;
        case 'rebalance':
          // Execute rebalancing
          console.log(`Rebalancing: ${decision.action}`);
          break;
        default:
          break;
      }

      decision.status = 'completed';
      decision.txHash = `0x${uuidv4().replace(/-/g, '')}`;

      this.wsService.broadcast({
        type: 'decision_completed',
        data: decision
      });

      return true;
    } catch (error) {
      decision.status = 'failed';
      this.wsService.broadcast({
        type: 'decision_failed',
        data: { decision, error: (error as Error).message }
      });
      return false;
    }
  }

  /**
   * Get all decisions
   */
  getDecisions(): Decision[] {
    return this.decisions;
  }

  /**
   * Get decision by ID
   */
  getDecision(id: string): Decision | undefined {
    return this.decisions.find(d => d.id === id);
  }
}
