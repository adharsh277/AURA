'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins, ExternalLink } from 'lucide-react'
import { TokenBalance } from '@/types'

interface WalletBalance {
  hbar: number
  tokens: TokenBalance[]
}

interface AssetTableProps {
  isConnected: boolean
  walletBalance?: WalletBalance
}

interface DisplayAsset {
  symbol: string
  name: string
  balance: string
  value: string
  price: string
  change: string
  isPositive: boolean
  allocation: number
  tokenId?: string
}

export default function AssetTable({ isConnected, walletBalance }: AssetTableProps) {
  const [hbarPrice, setHbarPrice] = useState(0.08)
  const [priceChange, setPriceChange] = useState(2.5)
  const [assets, setAssets] = useState<DisplayAsset[]>([])

  // Fetch HBAR price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd&include_24hr_change=true')
        const data = await response.json()
        if (data['hedera-hashgraph']) {
          setHbarPrice(data['hedera-hashgraph'].usd)
          setPriceChange(data['hedera-hashgraph'].usd_24h_change || 0)
        }
      } catch (err) {
        console.error('Failed to fetch price:', err)
      }
    }
    fetchPrice()
  }, [])

  // Build assets list from wallet balance
  useEffect(() => {
    if (!walletBalance) {
      setAssets([])
      return
    }

    const hbarBalance = walletBalance.hbar
    const hbarValue = hbarBalance * hbarPrice
    const totalValue = hbarValue // Add token values when available

    const displayAssets: DisplayAsset[] = []

    // Add HBAR
    if (hbarBalance > 0) {
      displayAssets.push({
        symbol: 'HBAR',
        name: 'Hedera',
        balance: hbarBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        value: `$${hbarValue.toFixed(2)}`,
        price: `$${hbarPrice.toFixed(4)}`,
        change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
        isPositive: priceChange >= 0,
        allocation: totalValue > 0 ? Math.round((hbarValue / totalValue) * 100) : 100
      })
    }

    // Add HTS tokens
    walletBalance.tokens?.forEach(token => {
      if (token.balance > 0) {
        const tokenBalance = token.decimals > 0 
          ? token.balance / Math.pow(10, token.decimals)
          : token.balance
        
        displayAssets.push({
          symbol: token.symbol || 'TOKEN',
          name: token.name || 'Unknown Token',
          balance: tokenBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          value: '--', // Price not available yet
          price: '--',
          change: '--',
          isPositive: true,
          allocation: 0,
          tokenId: token.tokenId
        })
      }
    })

    setAssets(displayAssets)
  }, [walletBalance, hbarPrice, priceChange])
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
