export interface MarketObservation {
  volatility: number;
  apy: number;
}

export async function observeMarket(): Promise<MarketObservation> {
  return {
    volatility: Math.random(),
    apy: Math.random() * 0.2,
  };
}
