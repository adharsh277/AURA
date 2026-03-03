import type { StrategyDecision } from './strategyEngine';

export interface AllocationPlan {
  USDT: number;
  XAUT: number;
  yield: number;
}

export interface EconomicReport {
  expectedReturn: number;
  worstCaseDrawdown: number;
  capitalEfficiency: number;
}

export async function planAllocation(
  strategy: StrategyDecision,
  capital: number
): Promise<AllocationPlan> {
  const reservePercent = 0.3;
  const maxDeployPercent = 0.7;

  let allocation: AllocationPlan = {
    USDT: capital * reservePercent,
    XAUT: 0,
    yield: 0,
  };

  if (strategy.mode === 'HEDGE') {
    allocation.XAUT = capital * 0.4;
  }

  if (strategy.mode === 'YIELD') {
    allocation.yield = capital * 0.2;
  }

  if (strategy.mode === 'SAFE') {
    allocation.USDT = capital;
  }

  const deployed = allocation.XAUT + allocation.yield;
  if (deployed > capital * maxDeployPercent) {
    const scale = (capital * maxDeployPercent) / deployed;
    allocation = {
      ...allocation,
      XAUT: allocation.XAUT * scale,
      yield: allocation.yield * scale,
      USDT: capital - (allocation.XAUT * scale + allocation.yield * scale),
    };
  }

  return allocation;
}

export function economicReport(plan: AllocationPlan, capital: number): EconomicReport {
  const expectedReturn = plan.yield * 0.12;
  const worstCaseDrawdown = capital * 0.08;

  return {
    expectedReturn,
    worstCaseDrawdown,
    capitalEfficiency: (expectedReturn / capital) * 100,
  };
}
