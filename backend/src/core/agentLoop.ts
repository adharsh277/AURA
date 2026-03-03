import { observeMarket } from './riskEngine';
import { evaluateStrategies } from './strategyEngine';
import { planAllocation, economicReport } from './economicEngine';
import { executePlan } from './executionEngine';
import { updateMemory, type AgentState } from './memoryStore';
import { logDecision } from './onchainLogger';
import { safetyCheck } from './safetyGuard';

export async function runAgent(state: AgentState) {
  const observation = await observeMarket();
  console.log('Observation:', observation);

  const strategy = await evaluateStrategies(observation, state.memory);
  console.log('Strategy selection:', strategy);

  const plan = await planAllocation(strategy, state.capital);
  const safePlan = safetyCheck(plan, state.capital);
  console.log('Allocation:', safePlan);

  const report = economicReport(safePlan, state.capital);
  console.log('Economic report:', report);

  const executionResult = await executePlan(safePlan);

  await logDecision({
    observation,
    strategy,
    plan: safePlan,
    executionResult,
  });

  updateMemory(state, observation, strategy, executionResult);

  return executionResult;
}
