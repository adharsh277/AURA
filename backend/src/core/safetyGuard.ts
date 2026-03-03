import type { AllocationPlan } from './economicEngine';

export function safetyCheck(plan: AllocationPlan, capital: number): AllocationPlan {
  const boundedPlan: AllocationPlan = {
    USDT: Math.max(0, plan.USDT),
    XAUT: Math.max(0, plan.XAUT),
    yield: Math.max(0, plan.yield),
  };

  const total = boundedPlan.USDT + boundedPlan.XAUT + boundedPlan.yield;

  if (total > capital) {
    return {
      USDT: capital,
      XAUT: 0,
      yield: 0,
    };
  }

  return boundedPlan;
}
