// Portfolio Types
export interface Asset {
  symbol: string
  name: string
  balance: number
  value: number
  price: number
  change24h: number
  allocation: number
}

export interface Portfolio {
  accountId: string
  totalValue: number
  totalChange24h: number
  totalChangePercent: number
  assets: Asset[]
  performance: {
    day: number
    week: number
    month: number
    year: number
  }
}

// AI Agent Types
export interface Decision {
  id: string
  type: 'stake' | 'swap' | 'protect' | 'rebalance' | 'hold'
  action: string
  reasoning: string[]
  riskScore: number
  confidenceScore: number
  expectedOutcome: string
  timestamp: Date
  status: 'pending' | 'executing' | 'completed' | 'failed'
  txHash?: string
}

export interface AgentStatus {
  isActive: boolean
  lastScan: Date | null
  totalDecisions: number
  activeStrategies: string[]
  currentRisk: number
}

// Risk Types
export interface RiskMetrics {
  overallRisk: number
  concentrationRisk: number
  volatilityRisk: number
  liquidityRisk: number
}

export interface RiskAnalysis {
  accountId: string
  riskLevel: 'low' | 'medium' | 'high'
  riskScore: number
  diversificationScore: number
  valueAtRisk: number
  recommendations: string[]
}

// Market Types
export interface TokenPrice {
  symbol: string
  price: number
  change24h: number
  volume24h: number
}

export interface MarketData {
  hbarPrice: number
  prices: TokenPrice[]
  marketTrend: 'bullish' | 'bearish' | 'neutral'
  volatilityIndex: number
}

export interface YieldPool {
  name: string
  apy: number
  tvl: number
  risk: 'low' | 'medium' | 'high'
  token: string
}

// Wallet Types
export interface WalletConnection {
  isConnected: boolean
  accountId: string
  network: 'mainnet' | 'testnet'
  provider: 'hashpack' | 'metamask' | 'xverse'
  publicKey?: string
  balance?: {
    hbar: number
    tokens: TokenBalance[]
  }
}

export interface TokenBalance {
  tokenId: string
  symbol: string
  name: string
  balance: number
  decimals: number
}

// Transaction Types
export interface TransactionRequest {
  type: 'transfer' | 'stake' | 'swap' | 'contract'
  description: string
  data: {
    recipient?: string
    amount?: number
    tokenId?: string
    contractId?: string
    functionName?: string
    params?: any[]
  }
}

export interface TransactionResult {
  success: boolean
  transactionId?: string
  explorerUrl?: string
  error?: string
}

// AI Suggestion Types
export interface AISuggestion {
  id: string
  actionType: 'rebalance' | 'stake' | 'swap' | 'protect' | 'hold'
  title: string
  description: string
  steps: string[]
  confidence: number
  riskBefore: number
  riskAfter: number
  expectedOutcome: string
  transactionData?: TransactionRequest
}

// WebSocket Message Types
export interface WSMessage {
  type: string
  data: any
  timestamp?: Date
}

export type WSMessageType = 
  | 'connected'
  | 'agent_status'
  | 'scan_complete'
  | 'decision_executing'
  | 'decision_completed'
  | 'decision_failed'
  | 'price_update'
  | 'portfolio_update'
