import type { MarketObservation } from './riskEngine';

export type StrategyMode = 'HEDGE' | 'YIELD' | 'SAFE';

export interface StrategyDecision {
  mode: StrategyMode;
  reason: string;
}

export async function evaluateStrategies(
  observation: MarketObservation,
  memory: unknown
): Promise<StrategyDecision> {
  const { volatility, apy } = observation;

  if (volatility > 0.7) {
    return { mode: 'HEDGE', reason: 'High volatility detected' };
  }

  if (apy > 0.12) {
    return { mode: 'YIELD', reason: 'High risk-adjusted APY' };
  }

  return { mode: 'SAFE', reason: 'Capital preservation mode' };
}
