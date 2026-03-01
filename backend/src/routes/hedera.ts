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

/**
 * Prepare transaction for wallet signing
 * POST /api/hedera/prepare-transaction
 * 
 * This endpoint prepares transaction data that will be signed by the user's wallet.
 * The AI suggests actions, but the wallet must sign for execution.
 */
router.post('/prepare-transaction', async (req: Request, res: Response) => {
  try {
    const { accountId, type, description, amount, recipient, tokenId } = req.body;

    if (!accountId || !type) {
      return res.status(400).json({ error: 'Missing required fields: accountId, type' });
    }

    // Validate transaction type
    const validTypes = ['transfer', 'stake', 'swap', 'rebalance', 'protect'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` });
    }

    // In production, this would create actual transaction bytes using Hedera SDK
    // For demo, we return transaction metadata that would be sent to the wallet
    const transactionId = `${accountId}@${Math.floor(Date.now() / 1000)}.${Math.floor(Math.random() * 1000000000)}`;
    
    const transactionData = {
      transactionId,
      type,
      description: description || `${type} transaction`,
      from: accountId,
      to: recipient || '0.0.98', // Default treasury for demo
      amount: amount || 0,
      tokenId: tokenId || null,
      network: process.env.HEDERA_NETWORK || 'testnet',
      validStart: new Date().toISOString(),
      validDuration: 120, // seconds
      // In production: transactionBytes would be the serialized transaction
      transactionBytes: Buffer.from(JSON.stringify({
        type,
        from: accountId,
        to: recipient || '0.0.98',
        amount
      })).toString('base64')
    };

    res.json({
      success: true,
      transaction: transactionData,
      message: 'Transaction prepared. Please sign with your wallet.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error preparing transaction:', error);
    res.status(500).json({ error: 'Failed to prepare transaction' });
  }
});

/**
 * Execute AI-recommended action
 * POST /api/hedera/execute-ai-action
 * 
 * This endpoint receives signed transaction data from the wallet
 * and submits it to the Hedera network.
 */
router.post('/execute-ai-action', async (req: Request, res: Response) => {
  try {
    const { accountId, actionType, signedTransaction, transactionId } = req.body;

    if (!accountId || !actionType) {
      return res.status(400).json({ error: 'Missing required fields: accountId, actionType' });
    }

    // In production, this would submit the signed transaction to Hedera
    // For demo, we simulate successful execution
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate transaction result
    const result = {
      success: true,
      transactionId: transactionId || `${accountId}@${Math.floor(Date.now() / 1000)}.${Math.floor(Math.random() * 1000000000)}`,
      actionType,
      status: 'SUCCESS',
      explorerUrl: `https://hashscan.io/${process.env.HEDERA_NETWORK || 'testnet'}/transaction/${transactionId}`,
      executedAt: new Date().toISOString(),
      details: {
        accountId,
        actionType,
        network: process.env.HEDERA_NETWORK || 'testnet'
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error executing AI action:', error);
    res.status(500).json({ error: 'Failed to execute action' });
  }
});

export default router;
