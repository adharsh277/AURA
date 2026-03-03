import type { MarketObservation } from './riskEngine';
import type { StrategyDecision } from './strategyEngine';
import type { ExecutionResult } from './executionEngine';

export interface AgentMemory {
  lastObservation: MarketObservation | null;
  lastStrategy: StrategyDecision | null;
  performance: ExecutionResult[];
}

export interface AgentState {
  capital: number;
  memory: AgentMemory;
}

export function updateMemory(
  state: AgentState,
  observation: MarketObservation,
  strategy: StrategyDecision,
  result: ExecutionResult
): void {
  state.memory.lastObservation = observation;
  state.memory.lastStrategy = strategy;
  state.memory.performance.push(result);
}
