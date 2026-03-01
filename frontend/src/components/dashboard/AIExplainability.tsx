'use client'

import { motion } from 'framer-motion'
import { Brain, AlertTriangle, TrendingUp, Shield, Info, ChevronRight } from 'lucide-react'

interface AIExplainabilityProps {
  isConnected: boolean
}

const currentDecision = {
  action: 'Recommending: Stake 3,000 HBAR on SaucerSwap',
  reasoning: [
    'HBAR price has been stable for 72 hours',
    'SaucerSwap APY increased to 12.5%',
    'Current portfolio yield is below target',
    'Low gas fees detected on Hedera network'
  ],
  riskScore: 35,
  confidenceScore: 87,
  expectedOutcome: '+$450 estimated monthly yield',
  alternatives: [
    { action: 'Hold current positions', risk: 20, confidence: 65 },
    { action: 'Swap to USDC', risk: 15, confidence: 45 }
  ]
}

export default function AIExplainability({ isConnected }: AIExplainabilityProps) {
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-gold-400'
    if (score <= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getRiskLabel = (score: number) => {
    if (score <= 30) return 'Low Risk'
    if (score <= 60) return 'Medium Risk'
    return 'High Risk'
  }

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-dark-950" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Decision Explainer</h2>
            <p className="text-sm text-dark-400">Understand why AI makes each decision</p>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-xs text-gold-400 font-medium">Live Analysis</span>
        </motion.div>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-32 text-dark-400">
          <Brain className="w-12 h-12 mb-3 text-dark-600" />
          <p>Connect wallet to see AI reasoning</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Recommendation */}
          <div className="lg:col-span-2">
            <div className="bg-dark-900/50 rounded-xl p-4 border border-gold-400/20 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                <h3 className="font-semibold text-white">{currentDecision.action}</h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-dark-400 mb-2">Why this decision:</p>
                {currentDecision.reasoning.map((reason, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ChevronRight className="w-4 h-4 text-gold-400" />
                    <span className="text-sm text-dark-300">{reason}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gold-400/10">
                <p className="text-sm text-gold-400 font-medium">{currentDecision.expectedOutcome}</p>
              </div>
            </div>

            {/* Alternative Actions */}
            <div>
              <p className="text-sm text-dark-400 mb-2">Alternative actions considered:</p>
              <div className="flex gap-3">
                {currentDecision.alternatives.map((alt, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 p-3 rounded-lg bg-dark-900/30 border border-dark-700/50"
                    whileHover={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}
                  >
                    <p className="text-sm text-dark-300 mb-2">{alt.action}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={getRiskColor(alt.risk)}>Risk: {alt.risk}%</span>
                      <span className="text-dark-500">Confidence: {alt.confidence}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scores Panel */}
          <div className="space-y-4">
            {/* Risk Score */}
            <div className="bg-background-dark/50 rounded-xl p-4 border border-primary-blue/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${getRiskColor(currentDecision.riskScore)}`} />
                  <span className="text-sm text-dark-400">Risk Score</span>
                </div>
                <span className={`text-2xl font-bold ${getRiskColor(currentDecision.riskScore)}`}>
                  {currentDecision.riskScore}%
                </span>
              </div>
              <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    currentDecision.riskScore <= 30 ? 'bg-gold-400' :
                    currentDecision.riskScore <= 60 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentDecision.riskScore}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className={`text-xs mt-2 ${getRiskColor(currentDecision.riskScore)}`}>
                {getRiskLabel(currentDecision.riskScore)}
              </p>
            </div>

            {/* Confidence Score */}
            <div className="bg-dark-900/50 rounded-xl p-4 border border-gold-400/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gold-400" />
                  <span className="text-sm text-dark-400">Confidence</span>
                </div>
                <span className="text-2xl font-bold text-gold-400">
                  {currentDecision.confidenceScore}%
                </span>
              </div>
              <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentDecision.confidenceScore}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <p className="text-xs mt-2 text-gold-400">High Confidence</p>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-gold-400/5 border border-gold-400/10">
              <Info className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-dark-400">
                AI analyzes market data, portfolio risk, and yield opportunities to make optimal decisions.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
