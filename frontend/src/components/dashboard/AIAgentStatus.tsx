'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Zap, Shield, TrendingUp, Play, Pause, Settings } from 'lucide-react'
import { AutonomousTreasury } from '@/types'

interface AIAgentStatusProps {
  isConnected: boolean
  userWalletAddress: string | null
  treasury: AutonomousTreasury | null
  isCreatingTreasury: boolean
  isUpdatingAutonomy: boolean
  isRunningStress: boolean
  treasuryError: string | null
  onCreateTreasury: () => Promise<void>
  onSetAutonomyLevel: (level: 'SUPERVISED' | 'FULL_AUTONOMOUS') => Promise<void>
  onRunStressScenario: (scenario: 'market_crash' | 'yield_collapse' | 'liquidity_shock') => Promise<void>
}

export default function AIAgentStatus({
  isConnected,
  userWalletAddress,
  treasury,
  isCreatingTreasury,
  isUpdatingAutonomy,
  isRunningStress,
  treasuryError,
  onCreateTreasury,
  onSetAutonomyLevel,
  onRunStressScenario
}: AIAgentStatusProps) {
  const [isAgentActive, setIsAgentActive] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [showRiskModel, setShowRiskModel] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  const agentMetrics = [
    { label: 'Risk Level', value: 'Medium', color: 'text-amber-400' },
    { label: 'Strategy', value: treasury ? 'Autonomous Treasury' : 'Awaiting Treasury', color: 'text-gold-400' },
    { label: 'Mode', value: treasury?.analytics.mode || 'SAFE', color: 'text-green-400' },
    { label: 'Status', value: isAgentActive ? 'Active' : 'Paused', color: isAgentActive ? 'text-gold-400' : 'text-dark-400' },
  ]

  const formatAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`

  return (
    <motion.div
      className="glass-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Agent</h2>
        <button
          onClick={() => setIsAgentActive(!isAgentActive)}
          className={`p-2 rounded-lg transition-all ${
            isAgentActive
              ? 'bg-gold-400/20 text-gold-400 hover:bg-gold-400/30'
              : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
          }`}
        >
          {isAgentActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      <div className="mb-4 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
        <p className="text-xs text-dark-400 mb-2">Autonomy Level</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSetAutonomyLevel('SUPERVISED')}
            disabled={!treasury || isUpdatingAutonomy}
            className={`py-2 rounded-lg text-xs font-medium border transition-all ${
              treasury?.autonomyState.level === 'SUPERVISED'
                ? 'border-gold-400/50 bg-gold-400/10 text-gold-400'
                : 'border-dark-700 text-dark-400 hover:text-white'
            } disabled:opacity-50`}
          >
            Supervised
          </button>
          <button
            onClick={() => onSetAutonomyLevel('FULL_AUTONOMOUS')}
            disabled={!treasury || isUpdatingAutonomy}
            className={`py-2 rounded-lg text-xs font-medium border transition-all ${
              treasury?.autonomyState.level === 'FULL_AUTONOMOUS'
                ? 'border-green-400/50 bg-green-400/10 text-green-400'
                : 'border-dark-700 text-dark-400 hover:text-white'
            } disabled:opacity-50`}
          >
            Full Autonomous
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative">
          {isConnected && isAgentActive && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-gold-400/30"
                style={{ width: 160, height: 160, left: -20, top: -20 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-gold-500/30"
                style={{ width: 160, height: 160, left: -20, top: -20 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          <motion.div
            className={`w-28 h-28 rounded-full flex items-center justify-center relative ${
              isConnected ? 'bg-gradient-to-br from-gold-400 to-gold-600' : 'bg-dark-700'
            }`}
            animate={isAgentActive && isConnected ? {
              boxShadow: [
                '0 0 20px rgba(255, 215, 0, 0.5)',
                '0 0 60px rgba(255, 215, 0, 0.8), 0 0 80px rgba(247, 147, 26, 0.4)',
                '0 0 20px rgba(255, 215, 0, 0.5)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-2 rounded-full bg-dark-950/80 flex items-center justify-center">
              <motion.div
                animate={isScanning ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
              >
                <Bot className={`w-10 h-10 ${isConnected ? 'text-gold-400' : 'text-dark-500'}`} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {agentMetrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between py-2 border-b border-gold-400/10">
            <span className="text-sm text-gray-400">{metric.label}</span>
            <span className={`text-sm font-medium ${metric.color}`}>{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="mb-6 p-3 rounded-xl bg-dark-800/50 border border-dark-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-dark-400">User Wallet (Optional)</span>
          <span className={`text-xs font-medium ${userWalletAddress ? 'text-gold-400' : 'text-dark-500'}`}>
            {userWalletAddress ? formatAddress(userWalletAddress) : 'Not connected'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-dark-400">Agent Wallet (Primary)</span>
          <span className={`text-xs font-medium ${treasury ? 'text-green-400' : 'text-dark-500'}`}>
            {treasury ? formatAddress(treasury.agentWallet.walletAddress) : 'Not created'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-dark-400">Expected Return</span>
          <span className="text-xs font-medium text-gold-400">
            {treasury ? `${treasury.analytics.expectedReturnPercent}%` : '--'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-dark-400">Worst Case Exposure</span>
          <span className="text-xs font-medium text-red-400">
            {treasury ? `${treasury.analytics.worstCaseExposurePercent}%` : '--'}
          </span>
        </div>
      </div>

      {treasury && (
        <div className="mb-6 p-3 rounded-xl bg-dark-800/50 border border-dark-700 space-y-2">
          <p className="text-xs text-dark-400">On-Chain Proof</p>
          <div className="text-[10px] text-dark-400">Decision Hash</div>
          <div className="text-[10px] font-mono text-green-400 break-all">{treasury.onchainProof.decisionHash}</div>
          <div className="text-[10px] text-dark-400 mt-1">Transaction ID</div>
          <div className="text-[10px] font-mono text-gold-400 break-all">{treasury.onchainProof.transactionId}</div>
          <a href={treasury.onchainProof.explorerUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 underline break-all">
            {treasury.onchainProof.explorerUrl}
          </a>
          <div className="text-[10px] text-dark-400 mt-1">Signed Agent Wallet</div>
          <div className="text-[10px] font-mono text-white break-all">{treasury.onchainProof.signedAgentWalletAddress}</div>
          <div className="text-[10px] text-dark-400 mt-1">Policy Version Hash</div>
          <div className="text-[10px] font-mono text-purple-300 break-all">{treasury.onchainProof.policyVersionHash}</div>
        </div>
      )}

      {treasury && (
        <div className="mb-6 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
          <p className="text-xs text-dark-400 mb-2">Strategy Performance</p>
          <div className="grid grid-cols-4 gap-2 text-[10px] text-dark-500 mb-1">
            <span>Mode</span><span>Times</span><span>Avg Return</span><span>Max DD</span>
          </div>
          {treasury.strategyPerformance.map((row) => (
            <div key={row.mode} className="grid grid-cols-4 gap-2 text-xs py-1 border-t border-dark-700/60">
              <span className="text-white">{row.mode}</span>
              <span className="text-gold-400">{row.timesActivated}</span>
              <span className="text-green-400">{row.avgReturnPercent}%</span>
              <span className="text-red-400">{row.maxDrawdownPercent}%</span>
            </div>
          ))}
        </div>
      )}

      {treasury && (
        <div className="mb-6 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
          <p className="text-xs text-dark-400 mb-2">Treasury Rules</p>
          <div className="space-y-1">
            {treasury.treasuryPolicy.rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between text-xs">
                <span className="text-dark-400">{rule.label}</span>
                <span className="text-white">{rule.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {treasury && (
        <div className="mb-6 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
          <button
            onClick={() => setShowRiskModel(!showRiskModel)}
            className="w-full text-left text-xs text-gold-400 font-medium mb-2"
          >
            Risk Model Details {showRiskModel ? '▲' : '▼'}
          </button>
          {showRiskModel && (
            <div className="space-y-2 text-xs">
              <p><span className="text-dark-400">Volatility:</span> <span className="text-white">{treasury.riskModel.volatilityInput}</span></p>
              <p><span className="text-dark-400">APY Weighting:</span> <span className="text-white">{treasury.riskModel.apyWeighting}</span></p>
              <p><span className="text-dark-400">Hedge Correlation:</span> <span className="text-white">{treasury.riskModel.hedgeCorrelation}</span></p>
              <p><span className="text-dark-400">Drawdown Method:</span> <span className="text-white">{treasury.riskModel.drawdownMethod}</span></p>
            </div>
          )}
        </div>
      )}

      {treasury && (
        <div className="mb-6 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
          <p className="text-xs text-dark-400 mb-2">Run Stress Scenario</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button onClick={() => onRunStressScenario('market_crash')} disabled={isRunningStress} className="text-[10px] py-2 rounded border border-dark-700 text-dark-300 hover:text-white disabled:opacity-50">20% Crash</button>
            <button onClick={() => onRunStressScenario('yield_collapse')} disabled={isRunningStress} className="text-[10px] py-2 rounded border border-dark-700 text-dark-300 hover:text-white disabled:opacity-50">Yield Drop</button>
            <button onClick={() => onRunStressScenario('liquidity_shock')} disabled={isRunningStress} className="text-[10px] py-2 rounded border border-dark-700 text-dark-300 hover:text-white disabled:opacity-50">Liquidity</button>
          </div>
          {treasury.lastStressTest && (
            <div className="text-xs space-y-1">
              <p className="text-white">Post-shock capital: ${treasury.lastStressTest.postShockCapital.toFixed(2)}</p>
              <p className="text-red-400">Drawdown: {treasury.lastStressTest.estimatedDrawdownPercent}%</p>
              <p className={treasury.lastStressTest.guardianTriggered ? 'text-amber-400' : 'text-green-400'}>
                Guardian {treasury.lastStressTest.guardianTriggered ? 'Triggered' : 'Not Triggered'}
              </p>
            </div>
          )}
        </div>
      )}

      {treasury?.capitalGuardian.enabled && (
        <div className={`mb-4 p-2 rounded-lg border text-xs ${treasury.capitalGuardian.isLocked ? 'border-amber-400/40 bg-amber-400/10 text-amber-400' : 'border-green-400/30 bg-green-400/10 text-green-400'}`}>
          Capital Guardian: {treasury.capitalGuardian.isLocked ? `LOCKED (${treasury.capitalGuardian.lockReason})` : 'Active'}
        </div>
      )}

      <div className="mb-4 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
        <p className="text-xs text-dark-400 mb-2">Agent Cycle Status</p>
        <div className="space-y-1 text-xs">
          <p className="text-green-400">Observation ✔</p>
          <p className="text-green-400">Strategy Selection ✔</p>
          <p className="text-green-400">Execution ✔</p>
          <p className="text-green-400">On-Chain Log ✔</p>
          <p className="text-green-400">Memory Update ✔</p>
        </div>
      </div>

      {!treasury && (
        <motion.button
          onClick={onCreateTreasury}
          disabled={isCreatingTreasury}
          className={`w-full py-3 rounded-xl font-semibold transition-all mb-4 ${
            isCreatingTreasury ? 'bg-dark-800 text-dark-400 cursor-not-allowed' : 'btn-primary'
          }`}
          whileHover={!isCreatingTreasury ? { scale: 1.02 } : {}}
          whileTap={!isCreatingTreasury ? { scale: 0.98 } : {}}
        >
          {isCreatingTreasury ? 'Creating Autonomous Treasury...' : 'Create Autonomous Treasury'}
        </motion.button>
      )}

      {treasuryError && (
        <div className="mb-4 p-2 rounded-lg border border-red-400/30 bg-red-400/10 text-xs text-red-400">
          {treasuryError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        <motion.button
          className="p-3 rounded-xl bg-gold-400/10 border border-gold-400/20 hover:border-gold-400/40 transition-all flex flex-col items-center gap-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Shield className="w-5 h-5 text-gold-400" />
          <span className="text-xs text-dark-400">Protect</span>
        </motion.button>
        <motion.button
          className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:border-gold-500/40 transition-all flex flex-col items-center gap-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TrendingUp className="w-5 h-5 text-gold-500" />
          <span className="text-xs text-dark-400">Optimize</span>
        </motion.button>
        <motion.button
          className="p-3 rounded-xl bg-dark-800/50 border border-dark-700/20 hover:border-dark-600/40 transition-all flex flex-col items-center gap-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-5 h-5 text-dark-400" />
          <span className="text-xs text-dark-400">Settings</span>
        </motion.button>
      </div>

      <motion.button
        onClick={handleScan}
        disabled={!isConnected || isScanning}
        className={`w-full py-3 rounded-xl font-semibold transition-all relative overflow-hidden ${
          isConnected
            ? 'btn-primary'
            : 'bg-dark-800 text-dark-400 cursor-not-allowed'
        }`}
        whileHover={isConnected ? { scale: 1.02 } : {}}
        whileTap={isConnected ? { scale: 0.98 } : {}}
      >
        {isConnected && !isScanning && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: [
                'inset 0 0 0px rgba(255, 215, 0, 0)',
                'inset 0 0 20px rgba(255, 215, 0, 0.3)',
                'inset 0 0 0px rgba(255, 215, 0, 0)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div className="flex items-center justify-center gap-2">
          <Zap className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Treasury...' : 'Scan & Optimize'}</span>
        </div>
      </motion.button>
    </motion.div>
  )
}
