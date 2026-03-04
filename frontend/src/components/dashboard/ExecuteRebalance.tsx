'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, PlayCircle } from 'lucide-react'
import { useTreasury } from '@/hooks/useTreasury'

interface ExecuteRebalanceProps {
  userAddress?: string
  isConnected: boolean
  mode?: 'SAFE' | 'YIELD' | 'HEDGE'
}

export default function ExecuteRebalance({ userAddress, isConnected, mode }: ExecuteRebalanceProps) {
  const { executeRebalance, isExecuting, txHash, txExplorerUrl, error, userUsdtBalance, vaultUsdtBalance, lastRebalancedEvent } = useTreasury(userAddress)

  const [reserveAmount, setReserveAmount] = useState('3000')
  const [hedgeAmount, setHedgeAmount] = useState('2500')
  const [yieldAmount, setYieldAmount] = useState('4500')
  const [safeModeMessage, setSafeModeMessage] = useState<string | null>(null)

  const total = useMemo(() => {
    const r = Number(reserveAmount || 0)
    const h = Number(hedgeAmount || 0)
    const y = Number(yieldAmount || 0)
    return r + h + y
  }, [reserveAmount, hedgeAmount, yieldAmount])

  const isSafeModeYieldBlocked = mode === 'SAFE' && Number(yieldAmount || 0) > 0

  const onExecute = async () => {
    if (!userAddress) return

    if (mode === 'SAFE' && Number(yieldAmount || 0) > 0) {
      setSafeModeMessage('Yield deployment disabled while SAFE mode is active')
      return
    }

    setSafeModeMessage(null)

    await executeRebalance({
      reserveWallet: userAddress,
      hedgeWallet: userAddress,
      yieldWallet: userAddress,
      reserveAmount,
      hedgeAmount,
      yieldAmount,
    })
  }

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Execute Rebalance</h2>
        <span className="text-xs text-dark-400">Sepolia only (11155111)</span>
      </div>

      <div className="mb-4 rounded-lg border border-dark-700 bg-dark-900/50 p-3 text-xs text-dark-300">
        Demo token context: Sepolia testnet uses MockUSDT / MockXAUT assets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <label className="text-xs text-dark-400">
          Reserve MockUSDT
          <input value={reserveAmount} onChange={(e) => setReserveAmount(e.target.value)} className="mt-1 w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-white" />
        </label>
        <label className="text-xs text-dark-400">
          Hedge MockUSDT
          <input value={hedgeAmount} onChange={(e) => setHedgeAmount(e.target.value)} className="mt-1 w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-white" />
        </label>
        <label className="text-xs text-dark-400">
          Yield MockUSDT
          <input value={yieldAmount} onChange={(e) => setYieldAmount(e.target.value)} className="mt-1 w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-white" />
        </label>
      </div>

      <div className="text-xs text-dark-400 mb-4">Total allocation: <span className="text-white">{total.toLocaleString()} USD₮</span></div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="rounded-lg border border-dark-700 bg-dark-900/50 p-3">
          <div className="text-dark-400">User USD₮ Balance</div>
          <div className="text-white text-sm font-semibold">{userUsdtBalance.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-dark-700 bg-dark-900/50 p-3">
          <div className="text-dark-400">Vault USD₮ Balance</div>
          <div className="text-white text-sm font-semibold">{vaultUsdtBalance.toLocaleString()}</div>
        </div>
      </div>

      <button
        onClick={onExecute}
        disabled={!isConnected || !userAddress || isExecuting || isSafeModeYieldBlocked}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <PlayCircle className="w-4 h-4" />
        {isExecuting ? 'Executing on-chain...' : 'Execute Rebalance'}
      </button>

      {isSafeModeYieldBlocked && (
        <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-300">
          🔒 SAFE MODE ACTIVE
          <br />
          Yield deployment temporarily disabled for capital protection.
        </div>
      )}

      {safeModeMessage && (
        <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-300">
          {safeModeMessage}
        </div>
      )}

      {txHash && (
        <div className="mt-4 rounded-lg border border-green-400/30 bg-green-400/10 p-3 text-xs">
          <div className="text-green-400">Transaction Hash</div>
          <div className="font-mono text-white break-all">{txHash}</div>
          {txExplorerUrl && (
            <a href={txExplorerUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-blue-400 underline">
              View on Etherscan <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {lastRebalancedEvent && (
        <div className="mt-4 rounded-lg border border-gold-400/20 bg-gold-400/5 p-3 text-xs">
          <div className="text-gold-400">Rebalanced Event Received</div>
          <div className="text-white mt-1">reserve: {lastRebalancedEvent.reserveAmount}</div>
          <div className="text-white">hedge: {lastRebalancedEvent.hedgeAmount}</div>
          <div className="text-white">yield: {lastRebalancedEvent.yieldAmount}</div>
        </div>
      )}

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-400">{error}</div>}
    </motion.div>
  )
}
