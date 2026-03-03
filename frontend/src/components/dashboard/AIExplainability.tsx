'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, AlertTriangle, TrendingUp, Shield, Info, ChevronRight, Zap, CheckCircle, ExternalLink, Loader2, XCircle } from 'lucide-react'

interface AIExplainabilityProps {
  isConnected: boolean
  accountId?: string
  onExecute?: (transactionData: any) => Promise<{ success: boolean; transactionId?: string; error?: string }>
}

interface AISuggestion {
  id: string
  actionType: 'rebalance' | 'stake' | 'swap' | 'protect' | 'hold'
  title: string
  description: string
  steps: string[]
  confidence: number
  riskBefore: number
  riskAfter: number
  expectedOutcome: string
  amount?: number
}

// Mock AI suggestion (in production, this would come from the backend)
const mockSuggestion: AISuggestion = {
  id: 'suggestion-1',
  actionType: 'rebalance',
  title: 'Optimize Treasury Allocation',
  description: 'AI recommends rebalancing reserve, hedge, and yield lanes for stable capital performance.',
  steps: [
    'Set USD₮ reserve to 30% of treasury capital',
    'Deploy 45% to yield strategy lane',
    'Allocate 25% to XAU₮ hedge lane',
    'Re-evaluate mode in next autonomous cycle'
  ],
  confidence: 84,
  riskBefore: 72,
  riskAfter: 45,
  expectedOutcome: 'Reduced risk by 27 points with +7.2% risk-adjusted expected return',
  amount: 10
}

export default function AIExplainability({ isConnected, accountId, onExecute }: AIExplainabilityProps) {
  const [suggestion, setSuggestion] = useState<AISuggestion>(mockSuggestion)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{
    status: 'idle' | 'pending' | 'success' | 'failed'
    transactionId?: string
    error?: string
  }>({ status: 'idle' })

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400'
    if (score <= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getRiskLabel = (score: number) => {
    if (score <= 30) return 'Low Risk'
    if (score <= 60) return 'Medium Risk'
    return 'High Risk'
  }

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return 'bg-green-400'
    if (score <= 60) return 'bg-amber-400'
    return 'bg-red-400'
  }

  const handleExecute = async () => {
    if (!onExecute || !suggestion) return

    setIsExecuting(true)
    setExecutionResult({ status: 'pending' })

    try {
      // Prepare transaction data based on suggestion
      const transactionData = {
        type: suggestion.actionType,
        description: suggestion.title,
        amount: suggestion.amount || 10,
        recipient: '0.0.98' // Treasury account for demo
      }

      const result = await onExecute(transactionData)

      if (result.success) {
        setExecutionResult({
          status: 'success',
          transactionId: result.transactionId
        })
      } else {
        setExecutionResult({
          status: 'failed',
          error: result.error || 'Transaction failed'
        })
      }
    } catch (err) {
      setExecutionResult({
        status: 'failed',
        error: (err as Error).message || 'Execution failed'
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const resetExecution = () => {
    setExecutionResult({ status: 'idle' })
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
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center"
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(255, 215, 0, 0)', '0 0 20px 5px rgba(255, 215, 0, 0.3)', '0 0 0 0 rgba(255, 215, 0, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-5 h-5 text-dark-950" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Decision Explainer</h2>
            <p className="text-sm text-dark-400">Transparent treasury reasoning for every autonomous action</p>
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
          <p>Connect wallet to see treasury reasoning</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Recommendation */}
          <div className="lg:col-span-2">
            <div className="bg-dark-900/50 rounded-xl p-5 border border-gold-400/20 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded-md bg-gold-400/10 text-gold-400 text-xs font-medium uppercase">
                    {suggestion.actionType}
                  </div>
                  <h3 className="font-semibold text-white">{suggestion.title}</h3>
                </div>
              </div>

              <p className="text-sm text-dark-300 mb-4">{suggestion.description}</p>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-dark-400">Execution Steps:</p>
                {suggestion.steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg bg-dark-800/50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-gold-400 font-medium">{index + 1}</span>
                    </div>
                    <span className="text-sm text-dark-300">{step}</span>
                  </motion.div>
                ))}
              </div>

              {/* Risk Comparison */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-dark-800/30 border border-dark-700 mb-4">
                <div>
                  <p className="text-xs text-dark-500 mb-1">Risk Before</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold ${getRiskColor(suggestion.riskBefore)}`}>
                      {suggestion.riskBefore}/100
                    </span>
                    <span className={`text-xs ${getRiskColor(suggestion.riskBefore)}`}>
                      {getRiskLabel(suggestion.riskBefore)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-dark-500 mb-1">Risk After</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold ${getRiskColor(suggestion.riskAfter)}`}>
                      {suggestion.riskAfter}/100
                    </span>
                    <span className={`text-xs ${getRiskColor(suggestion.riskAfter)}`}>
                      {getRiskLabel(suggestion.riskAfter)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expected Outcome */}
              <div className="p-3 rounded-lg bg-gold-400/5 border border-gold-400/20">
                <p className="text-sm text-gold-400 font-medium">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  {suggestion.expectedOutcome}
                </p>
              </div>
            </div>

            {/* Execution Panel */}
            <AnimatePresence mode="wait">
              {executionResult.status === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-900/30 border border-dark-700"
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-dark-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-dark-300">Ready to execute this treasury optimization?</p>
                      <p className="text-xs text-dark-500 mt-1">Your wallet will prompt you to sign the transaction.</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-dark-950 font-semibold hover:shadow-lg hover:shadow-gold-400/20 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="w-5 h-5" />
                    Execute Treasury Plan
                  </motion.button>
                </motion.div>
              )}

              {executionResult.status === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center p-8 rounded-xl bg-dark-900/30 border border-gold-400/30"
                >
                  <Loader2 className="w-10 h-10 text-gold-400 animate-spin mb-4" />
                  <p className="text-lg font-medium text-white">Waiting for Wallet Approval</p>
                  <p className="text-sm text-dark-400 mt-2">Please sign the transaction in MetaMask</p>
                </motion.div>
              )}

              {executionResult.status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-xl bg-green-400/10 border border-green-400/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">Transaction Successful!</p>
                      <p className="text-sm text-dark-400">Treasury allocation has been updated</p>
                    </div>
                  </div>
                  
                  {executionResult.transactionId && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 mb-4">
                      <div>
                        <p className="text-xs text-dark-500">Transaction ID</p>
                        <p className="text-sm text-white font-mono">{executionResult.transactionId}</p>
                      </div>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 text-gold-400 hover:bg-dark-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Decision Logged</span>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={resetExecution}
                    className="w-full py-2 rounded-lg bg-dark-800 text-dark-300 hover:text-white transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {executionResult.status === 'failed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-xl bg-red-400/10 border border-red-400/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-400/20 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">Transaction Failed</p>
                      <p className="text-sm text-red-400">{executionResult.error}</p>
                    </div>
                  </div>

                  <button
                    onClick={resetExecution}
                    className="w-full py-2 rounded-lg bg-dark-800 text-dark-300 hover:text-white transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scores Panel */}
          <div className="space-y-4">
            {/* Confidence Score */}
            <div className="bg-dark-900/50 rounded-xl p-4 border border-gold-400/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gold-400" />
                  <span className="text-sm text-dark-400">AI Confidence</span>
                </div>
                <span className="text-2xl font-bold text-gold-400">
                  {suggestion.confidence}%
                </span>
              </div>
              <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${suggestion.confidence}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <p className="text-xs mt-2 text-gold-400">High Confidence</p>
            </div>

            {/* Risk Reduction Visual */}
            <div className="bg-dark-900/50 rounded-xl p-4 border border-gold-400/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-dark-400">Risk Reduction</span>
              </div>
              
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getRiskColor(suggestion.riskBefore)}`}>
                    {suggestion.riskBefore}
                  </div>
                  <p className="text-xs text-dark-500">Before</p>
                </div>
                <motion.div
                  className="flex items-center"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-6 h-6 text-gold-400" />
                  <ChevronRight className="w-6 h-6 text-gold-400 -ml-3" />
                </motion.div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getRiskColor(suggestion.riskAfter)}`}>
                    {suggestion.riskAfter}
                  </div>
                  <p className="text-xs text-dark-500">After</p>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  -{suggestion.riskBefore - suggestion.riskAfter} points
                </span>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-gold-400/5 border border-gold-400/10">
              <Shield className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white font-medium mb-1">AI Never Holds Funds</p>
                <p className="text-xs text-dark-400">
                  AI suggests → You approve → Wallet signs → Network executes. Your keys, your control.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
