import axios from 'axios';

interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

interface MarketData {
  hbarPrice: number;
  prices: TokenPrice[];
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  volatilityIndex: number;
}

interface YieldPool {
  name: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  token: string;
}

export class PriceFeedService {
  private cachedPrices: Map<string, TokenPrice> = new Map();
  private lastUpdate: Date | null = null;
  private cacheExpiryMs: number = 30000; // 30 seconds

  /**
   * Get comprehensive market data
   */
  async getMarketData(): Promise<MarketData> {
    const prices = await this.getAllPrices();
    const hbarPrice = prices.find(p => p.symbol === 'HBAR')?.price || 0.08;
    
    // Calculate market trend based on price changes
    const avgChange = prices.reduce((sum, p) => sum + p.change24h, 0) / prices.length;
    let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (avgChange > 2) marketTrend = 'bullish';
    if (avgChange < -2) marketTrend = 'bearish';

    // Calculate volatility index
    const volatilityIndex = this.calculateVolatility(prices);

    return {
      hbarPrice,
      prices,
      marketTrend,
      volatilityIndex
    };
  }

  /**
   * Get all token prices
   */
  async getAllPrices(): Promise<TokenPrice[]> {
    // Check cache
    if (this.lastUpdate && Date.now() - this.lastUpdate.getTime() < this.cacheExpiryMs) {
      return Array.from(this.cachedPrices.values());
    }

    // In production, fetch from CoinGecko, SaucerSwap, or Hedera oracles
    const prices: TokenPrice[] = [
      { symbol: 'HBAR', price: 0.08, change24h: 5.2, volume24h: 45000000 },
      { symbol: 'USDC', price: 1.00, change24h: 0.01, volume24h: 120000000 },
      { symbol: 'SAUCE', price: 0.20, change24h: -2.1, volume24h: 5000000 },
      { symbol: 'HST', price: 0.25, change24h: 8.4, volume24h: 2000000 },
      { symbol: 'PACK', price: 0.30, change24h: 3.2, volume24h: 1500000 },
      { symbol: 'JAM', price: 0.015, change24h: -1.5, volume24h: 800000 },
      { symbol: 'KARATE', price: 0.002, change24h: 15.3, volume24h: 500000 }
    ];

    // Update cache
    prices.forEach(p => this.cachedPrices.set(p.symbol, p));
    this.lastUpdate = new Date();

    return prices;
  }

  /**
   * Get price for specific token
   */
  async getPrice(symbol: string): Promise<number> {
    const prices = await this.getAllPrices();
    const token = prices.find(p => p.symbol.toUpperCase() === symbol.toUpperCase());
    return token?.price || 0;
  }

  /**
   * Get yield opportunities from DEXs
   */
  async getYieldOpportunities(): Promise<number> {
    const pools = await this.getYieldPools();
    // Return best APY available
    return Math.max(...pools.map(p => p.apy));
  }

  /**
   * Get available yield pools
   */
  async getYieldPools(): Promise<YieldPool[]> {
    // In production, fetch from SaucerSwap and other DEXs
    return [
      { name: 'HBAR-USDC LP', apy: 12.5, tvl: 15000000, risk: 'low', token: 'HBAR' },
      { name: 'SAUCE Staking', apy: 18.2, tvl: 5000000, risk: 'medium', token: 'SAUCE' },
      { name: 'HST-HBAR LP', apy: 25.0, tvl: 2000000, risk: 'high', token: 'HST' },
      { name: 'HBAR Single Stake', apy: 6.5, tvl: 50000000, risk: 'low', token: 'HBAR' }
    ];
  }

  /**
   * Calculate market volatility
   */
  private calculateVolatility(prices: TokenPrice[]): number {
    const changes = prices.map(p => Math.abs(p.change24h));
    const avgVolatility = changes.reduce((a, b) => a + b, 0) / changes.length;
    return Math.min(100, avgVolatility * 10); // Normalize to 0-100
  }

  /**
   * Get historical price data
   */
  async getHistoricalPrices(symbol: string, days: number = 7): Promise<{ date: string; price: number }[]> {
    // Mock historical data
    const basePrice = await this.getPrice(symbol);
    const data: { date: string; price: number }[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      data.push({
        date: date.toISOString().split('T')[0],
        price: basePrice * (1 + variance)
      });
    }

    return data;
  }
}
