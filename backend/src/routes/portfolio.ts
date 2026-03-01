import { Router, Request, Response } from 'express';
import { hederaService } from '../services/HederaService';
import { PriceFeedService } from '../services/PriceFeedService';
import { RiskAnalyzer } from '../services/RiskAnalyzer';

const router = Router();
const priceFeed = new PriceFeedService();
const riskAnalyzer = new RiskAnalyzer();

/**
 * Get portfolio overview
 * GET /api/portfolio/:accountId
 */
router.get('/:accountId', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    
    // In production, fetch real data from Hedera
    const mockPortfolio = {
      accountId,
      totalValue: 28542.85,
      totalChange24h: 1234.56,
      totalChangePercent: 4.5,
      assets: [
        { 
          symbol: 'HBAR', 
          name: 'Hedera',
          balance: 45230.50, 
          value: 3618.44,
          price: 0.08,
          change24h: 5.2,
          allocation: 35
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin',
          balance: 8500.00, 
          value: 8500.00,
          price: 1.00,
          change24h: 0.0,
          allocation: 30
        },
        { 
          symbol: 'SAUCE', 
          name: 'SaucerSwap',
          balance: 12450.00, 
          value: 2490.00,
          price: 0.20,
          change24h: -2.1,
          allocation: 15
        },
        { 
          symbol: 'HST', 
          name: 'HeadStarter',
          balance: 5000.00, 
          value: 1250.00,
          price: 0.25,
          change24h: 8.4,
          allocation: 10
        },
        { 
          symbol: 'PACK', 
          name: 'HashPack',
          balance: 2150.00, 
          value: 645.00,
          price: 0.30,
          change24h: 3.2,
          allocation: 10
        }
      ],
      performance: {
        day: 4.5,
        week: 12.3,
        month: 28.7,
        year: 156.4
      }
    };

    res.json(mockPortfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

/**
 * Get portfolio risk analysis
 * GET /api/portfolio/:accountId/risk
 */
router.get('/:accountId/risk', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    
    const portfolio = {
      totalValue: 28542.85,
      assets: [
        { symbol: 'HBAR', value: 10000, allocation: 0.35 },
        { symbol: 'USDC', value: 8500, allocation: 0.30 },
        { symbol: 'SAUCE', value: 4285, allocation: 0.15 },
        { symbol: 'HST', value: 2857, allocation: 0.10 },
        { symbol: 'PACK', value: 2900, allocation: 0.10 }
      ]
    };

    const riskLevel = riskAnalyzer.assessRisk(portfolio);
    const diversification = riskAnalyzer.calculateDiversification(portfolio);
    const recommendations = riskAnalyzer.getRecommendations(portfolio);
    const var95 = riskAnalyzer.calculateVaR(portfolio, 0.95);

    res.json({
      accountId,
      riskLevel,
      riskScore: riskAnalyzer.getCurrentRisk(),
      diversificationScore: diversification,
      valueAtRisk: var95,
      recommendations
    });
  } catch (error) {
    console.error('Error analyzing risk:', error);
    res.status(500).json({ error: 'Failed to analyze risk' });
  }
});

/**
 * Get portfolio history
 * GET /api/portfolio/:accountId/history
 */
router.get('/:accountId/history', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { period = '7d' } = req.query;

    // Mock historical data
    const history = [
      { date: '2024-02-01', value: 25000 },
      { date: '2024-02-02', value: 25500 },
      { date: '2024-02-03', value: 26200 },
      { date: '2024-02-04', value: 25800 },
      { date: '2024-02-05', value: 27100 },
      { date: '2024-02-06', value: 27800 },
      { date: '2024-02-07', value: 28542 }
    ];

    res.json({ accountId, period, history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * Get yield opportunities
 * GET /api/portfolio/yield/opportunities
 */
router.get('/yield/opportunities', async (req: Request, res: Response) => {
  try {
    const pools = await priceFeed.getYieldPools();
    res.json({ pools });
  } catch (error) {
    console.error('Error fetching yield opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch yield opportunities' });
  }
});

export default router;
