interface Asset {
  symbol: string;
  value: number;
  allocation: number;
}

interface Portfolio {
  totalValue: number;
  assets: Asset[];
}

interface RiskMetrics {
  overallRisk: number;
  concentrationRisk: number;
  volatilityRisk: number;
  liquidityRisk: number;
}

export class RiskAnalyzer {
  private currentRisk: number = 35;
  private riskThresholds = {
    low: 30,
    medium: 60,
    high: 80
  };

  // Asset risk scores (higher = riskier)
  private assetRiskScores: Record<string, number> = {
    'USDC': 5,
    'USDT': 5,
    'HBAR': 30,
    'SAUCE': 55,
    'HST': 60,
    'PACK': 50,
    'JAM': 70,
    'KARATE': 80
  };

  /**
   * Assess overall portfolio risk
   */
  assessRisk(portfolio: Portfolio): 'low' | 'medium' | 'high' {
    const metrics = this.calculateRiskMetrics(portfolio);
    this.currentRisk = metrics.overallRisk;

    if (metrics.overallRisk <= this.riskThresholds.low) return 'low';
    if (metrics.overallRisk <= this.riskThresholds.medium) return 'medium';
    return 'high';
  }

  /**
   * Calculate detailed risk metrics
   */
  calculateRiskMetrics(portfolio: Portfolio): RiskMetrics {
    const concentrationRisk = this.calculateConcentrationRisk(portfolio);
    const volatilityRisk = this.calculateVolatilityRisk(portfolio);
    const liquidityRisk = this.calculateLiquidityRisk(portfolio);

    // Weighted average of all risk factors
    const overallRisk = Math.round(
      concentrationRisk * 0.3 +
      volatilityRisk * 0.5 +
      liquidityRisk * 0.2
    );

    return {
      overallRisk,
      concentrationRisk,
      volatilityRisk,
      liquidityRisk
    };
  }

  /**
   * Calculate concentration risk (single asset dominance)
   */
  private calculateConcentrationRisk(portfolio: Portfolio): number {
    const allocations = portfolio.assets.map(a => a.allocation);
    const maxAllocation = Math.max(...allocations);
    
    // If any asset > 50% of portfolio, high risk
    if (maxAllocation > 0.5) return 80;
    // If any asset > 30%, medium risk
    if (maxAllocation > 0.3) return 50;
    return 25;
  }

  /**
   * Calculate volatility risk based on asset composition
   */
  private calculateVolatilityRisk(portfolio: Portfolio): number {
    let weightedRisk = 0;
    
    portfolio.assets.forEach(asset => {
      const assetRisk = this.assetRiskScores[asset.symbol] || 50;
      weightedRisk += assetRisk * asset.allocation;
    });

    return Math.round(weightedRisk);
  }

  /**
   * Calculate liquidity risk
   */
  private calculateLiquidityRisk(portfolio: Portfolio): number {
    // Stablecoins have lowest liquidity risk
    const stableAllocation = portfolio.assets
      .filter(a => ['USDC', 'USDT'].includes(a.symbol))
      .reduce((sum, a) => sum + a.allocation, 0);

    // HBAR is highly liquid
    const hbarAllocation = portfolio.assets
      .find(a => a.symbol === 'HBAR')?.allocation || 0;

    const liquidAssets = stableAllocation + hbarAllocation;
    
    if (liquidAssets > 0.5) return 20;
    if (liquidAssets > 0.3) return 40;
    return 60;
  }

  /**
   * Calculate portfolio diversification score (0-1)
   */
  calculateDiversification(portfolio: Portfolio): number {
    const assetCount = portfolio.assets.length;
    
    // Perfect diversification would be equal allocation
    const perfectAllocation = 1 / assetCount;
    
    // Calculate deviation from perfect diversification
    let deviationSum = 0;
    portfolio.assets.forEach(asset => {
      deviationSum += Math.abs(asset.allocation - perfectAllocation);
    });

    // Normalize to 0-1 (1 = perfectly diversified)
    const diversification = 1 - (deviationSum / 2);
    return Math.max(0, Math.min(1, diversification));
  }

  /**
   * Get current risk level
   */
  getCurrentRisk(): number {
    return this.currentRisk;
  }

  /**
   * Check if portfolio exceeds risk threshold
   */
  exceedsThreshold(): boolean {
    const maxRisk = parseFloat(process.env.MAX_PORTFOLIO_RISK || '0.5') * 100;
    return this.currentRisk > maxRisk;
  }

  /**
   * Get risk recommendations
   */
  getRecommendations(portfolio: Portfolio): string[] {
    const recommendations: string[] = [];
    const metrics = this.calculateRiskMetrics(portfolio);

    if (metrics.concentrationRisk > 50) {
      recommendations.push('Consider diversifying - single asset concentration is high');
    }

    if (metrics.volatilityRisk > 60) {
      recommendations.push('Portfolio contains high-risk assets - consider adding stablecoins');
    }

    if (metrics.liquidityRisk > 50) {
      recommendations.push('Low liquidity detected - maintain higher HBAR or stablecoin allocation');
    }

    const stableAllocation = portfolio.assets
      .filter(a => ['USDC', 'USDT'].includes(a.symbol))
      .reduce((sum, a) => sum + a.allocation, 0);

    if (stableAllocation < 0.2) {
      recommendations.push('Consider holding at least 20% in stablecoins for stability');
    }

    return recommendations;
  }

  /**
   * Calculate Value at Risk (VaR)
   */
  calculateVaR(portfolio: Portfolio, confidenceLevel: number = 0.95): number {
    // Simplified VaR calculation
    // In production, use historical data and proper statistical methods
    const dailyVolatility = this.currentRisk / 100 * 0.05; // Assume 5% max daily volatility
    const zScore = confidenceLevel === 0.95 ? 1.65 : 2.33; // 95% or 99% confidence
    
    return portfolio.totalValue * dailyVolatility * zScore;
  }
}
