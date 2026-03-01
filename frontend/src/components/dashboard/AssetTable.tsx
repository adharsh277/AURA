'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins } from 'lucide-react'

interface AssetTableProps {
  isConnected: boolean
}

const assets = [
  { 
    symbol: 'HBAR', 
    name: 'Hedera', 
    balance: '45,230.50', 
    value: '$3,618.44',
    price: '$0.08',
    change: '+5.2%',
    isPositive: true,
    allocation: 35
  },
  { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    balance: '8,500.00', 
    value: '$8,500.00',
    price: '$1.00',
    change: '+0.0%',
    isPositive: true,
    allocation: 30
  },
  { 
    symbol: 'SAUCE', 
    name: 'SaucerSwap', 
    balance: '12,450.00', 
    value: '$2,490.00',
    price: '$0.20',
    change: '-2.1%',
    isPositive: false,
    allocation: 15
  },
  { 
    symbol: 'HST', 
    name: 'HeadStarter', 
    balance: '5,000.00', 
    value: '$1,250.00',
    price: '$0.25',
    change: '+8.4%',
    isPositive: true,
    allocation: 10
  },
  { 
    symbol: 'PACK', 
    name: 'HashPack', 
    balance: '2,150.00', 
    value: '$645.00',
    price: '$0.30',
    change: '+3.2%',
    isPositive: true,
    allocation: 10
  },
]

export default function AssetTable({ isConnected }: AssetTableProps) {
  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Your Assets</h2>
        <span className="text-sm text-gray-400">{assets.length} tokens</span>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-48 text-dark-400">
          <Coins className="w-12 h-12 mb-3 text-dark-600" />
          <p>Connect wallet to view assets</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 border-b border-gold-400/10">
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">24h</th>
                <th className="pb-3 font-medium">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <motion.tr 
                  key={asset.symbol}
                  className="border-b border-gold-400/5 hover:bg-gold-400/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-xs font-bold text-dark-950">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{asset.symbol}</p>
                        <p className="text-xs text-dark-400">{asset.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-white">{asset.balance}</p>
                    <p className="text-xs text-dark-400">{asset.value}</p>
                  </td>
                  <td className="py-4 text-white">{asset.price}</td>
                  <td className="py-4">
                    <div className={`flex items-center gap-1 ${asset.isPositive ? 'text-gold-400' : 'text-red-400'}`}>
                      {asset.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm">{asset.change}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${asset.allocation}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-dark-400 w-8">{asset.allocation}%</span>
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
