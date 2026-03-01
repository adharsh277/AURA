import { Router, Request, Response } from 'express';
import { hederaService } from '../services/HederaService';
import { PriceFeedService } from '../services/PriceFeedService';

const router = Router();
const priceFeed = new PriceFeedService();

/**
 * Get account info from Hedera
 * GET /api/hedera/account/:accountId
 */
router.get('/account/:accountId', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const accountInfo = await hederaService.getAccountInfo(accountId);
    res.json(accountInfo);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account info' });
  }
});

/**
 * Get current HBAR price
 * GET /api/hedera/price/hbar
 */
router.get('/price/hbar', async (req: Request, res: Response) => {
  try {
    const price = await priceFeed.getPrice('HBAR');
    res.json({ symbol: 'HBAR', price, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching HBAR price:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

/**
 * Get all token prices
 * GET /api/hedera/prices
 */
router.get('/prices', async (req: Request, res: Response) => {
  try {
    const prices = await priceFeed.getAllPrices();
    res.json({ prices, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

/**
 * Get market data
 * GET /api/hedera/market
 */
router.get('/market', async (req: Request, res: Response) => {
  try {
    const marketData = await priceFeed.getMarketData();
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

/**
 * Transfer HBAR
 * POST /api/hedera/transfer/hbar
 */
router.post('/transfer/hbar', async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required fields: from, to, amount' });
    }

    const status = await hederaService.transferHbar(from, to, amount);
    res.json({ 
      success: true, 
      status, 
      from, 
      to, 
      amount,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error transferring HBAR:', error);
    res.status(500).json({ error: 'Failed to transfer HBAR' });
  }
});

/**
 * Transfer tokens
 * POST /api/hedera/transfer/token
 */
router.post('/transfer/token', async (req: Request, res: Response) => {
  try {
    const { tokenId, from, to, amount } = req.body;
    
    if (!tokenId || !from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required fields: tokenId, from, to, amount' });
    }

    const status = await hederaService.transferToken(tokenId, from, to, amount);
    res.json({ 
      success: true, 
      status, 
      tokenId,
      from, 
      to, 
      amount,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error transferring token:', error);
    res.status(500).json({ error: 'Failed to transfer token' });
  }
});

/**
 * Associate token with account
 * POST /api/hedera/token/associate
 */
router.post('/token/associate', async (req: Request, res: Response) => {
  try {
    const { accountId, tokenId } = req.body;
    
    if (!accountId || !tokenId) {
      return res.status(400).json({ error: 'Missing required fields: accountId, tokenId' });
    }

    const status = await hederaService.associateToken(accountId, tokenId);
    res.json({ 
      success: true, 
      status, 
      accountId,
      tokenId,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error associating token:', error);
    res.status(500).json({ error: 'Failed to associate token' });
  }
});

/**
 * Get network status
 * GET /api/hedera/network
 */
router.get('/network', async (req: Request, res: Response) => {
  try {
    res.json({ 
      network: process.env.HEDERA_NETWORK || 'testnet',
      status: 'operational',
      latency: Math.floor(Math.random() * 50) + 10, // Mock latency in ms
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching network status:', error);
    res.status(500).json({ error: 'Failed to fetch network status' });
  }
});

export default router;
