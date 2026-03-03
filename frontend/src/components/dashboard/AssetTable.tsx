'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins } from 'lucide-react'
import { AutonomousTreasury } from '@/types'

interface AssetTableProps {
  isConnected: boolean
  treasury: AutonomousTreasury | null
}

interface AllocationRow {
  bucket: string
  balance: string
  weight: number
  indicator: string
  isPositive: boolean
}

export default function AssetTable({ isConnected, treasury }: AssetTableProps) {
  const reserve = treasury?.capital.usdtReserve ?? 3000
  const hedge = treasury?.capital.xautHedge ?? 2500
  const yieldDeployed = treasury?.capital.yieldDeployed ?? 4500
  const total = treasury?.capital.deposited ?? reserve + hedge + yieldDeployed

  const rows: AllocationRow[] = [
    {
      bucket: 'USD₮ Reserve',
      balance: `$${reserve.toLocaleString()}`,
      weight: Math.round((reserve / total) * 100),
      indicator: `${treasury?.analytics.stableReservePercent ?? 30}% stable reserve`,
      isPositive: true,
    },
    {
      bucket: 'XAU₮ Hedge',
      balance: `$${hedge.toLocaleString()}`,
      weight: Math.round((hedge / total) * 100),
      indicator: `${treasury?.analytics.mode ?? 'SAFE'} mode hedge`,
      isPositive: true,
    },
    {
      bucket: 'Yield Deployed',
      balance: `$${yieldDeployed.toLocaleString()}`,
      weight: Math.round((yieldDeployed / total) * 100),
      indicator: `${treasury?.analytics.expectedReturnPercent ?? 7.2}% expected return`,
      isPositive: true,
    },
    {
      bucket: 'Worst Case Exposure',
      balance: `${treasury?.analytics.worstCaseExposurePercent ?? -8}%`,
      weight: Math.abs(treasury?.analytics.worstCaseExposurePercent ?? -8),
      indicator: 'Stress scenario threshold',
      isPositive: false,
    },
  ]

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Treasury Allocation</h2>
        <span className="text-sm text-gray-400">{rows.length} buckets</span>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-48 text-dark-400">
          <Coins className="w-12 h-12 mb-3 text-dark-600" />
          <p>Connect wallet to view treasury allocation</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 border-b border-gold-400/10">
                <th className="pb-3 font-medium">Bucket</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">Signal</th>
                <th className="pb-3 font-medium">Weight</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <motion.tr
                  key={row.bucket}
                  className="border-b border-gold-400/5 hover:bg-gold-400/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-4">
                    <p className="font-medium text-white">{row.bucket}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-white">{row.balance}</p>
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center gap-1 ${row.isPositive ? 'text-gold-400' : 'text-red-400'}`}>
                      {row.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm">{row.indicator}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(0, Math.min(100, row.weight))}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-dark-400 w-9">{row.weight}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
