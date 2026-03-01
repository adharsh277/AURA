'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Percent, Activity, RefreshCw, Scan } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TokenBalance } from '@/types'

interface WalletBalance {
  hbar: number
  tokens: TokenBalance[]
}

interface PortfolioOverviewProps {
  isConnected: boolean
  accountId?: string
  walletBalance?: WalletBalance
  onRefresh?: () => Promise<void>
}

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Sample data for the chart
const chartData = [
  { date: 'Jan', value: 12000 },
  { date: 'Feb', value: 15000 },
  { date: 'Mar', value: 13500 },
  { date: 'Apr', value: 18000 },
  { date: 'May', value: 22000 },
  { date: 'Jun', value: 25000 },
  { date: 'Jul', value: 28500 },
]

export default function PortfolioOverview({ isConnected, accountId, walletBalance, onRefresh }: PortfolioOverviewProps) {
  const [hbarPrice, setHbarPrice] = useState(0.08) // Default price
  const [isLoading, setIsLoading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null)

  // Calculate portfolio value based on real balance
  const hbarBalance = walletBalance?.hbar || 0
  const hbarValue = hbarBalance * hbarPrice
  const totalValue = hbarValue // Add token values here when available

  // Fetch HBAR price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd&include_24hr_change=true')
        const data = await response.json()
        if (data['hedera-hashgraph']) {
          setHbarPrice(data['hedera-hashgraph'].usd)
        }
      } catch (err) {
        console.error('Failed to fetch price:', err)
      }
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Handle portfolio scan
  const handleScan = async () => {
    if (!accountId) return
    
    setIsScanning(true)
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/${accountId}/risk`)
      if (response.ok) {
        const data = await response.json()
        setRiskAnalysis(data)
      }
    } catch (err) {
      console.error('Scan failed:', err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true)
      await onRefresh()
      setIsLoading(false)
    }
  }

  const stats = [
    { 
      label: 'HBAR Balance', 
      value: isConnected ? hbarBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' HBAR' : '--', 
      change: `$${hbarValue.toFixed(2)} USD`, 
      isPositive: true,
      icon: DollarSign 
    },
    { 
      label: 'HBAR Price', 
      value: `$${hbarPrice.toFixed(4)}`, 
      change: '+2.5%', 
      isPositive: true,
      icon: TrendingUp 
    },
    { 
      label: 'Risk Score', 
      value: riskAnalysis?.riskScore || '--', 
      change: riskAnalysis?.riskLevel || 'Scan to analyze', 
      isPositive: riskAnalysis?.riskLevel !== 'high',
      icon: Percent 
    },
    { 
      label: 'Tokens', 
      value: isConnected ? (walletBalance?.tokens?.length || 0).toString() : '--', 
      change: 'HTS tokens', 
      isPositive: true,
      icon: Activity 
    },
  ]
  return (
    <motion.div 
      className="glass-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Portfolio Overview</h2>
          {isConnected && accountId && (
            <p className="text-sm text-dark-400 mt-1">Account: {accountId}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <>
              <motion.button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-300 hover:text-white hover:border-gold-400/30 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-xs hidden sm:inline">Refresh</span>
              </motion.button>
              <motion.button
                onClick={handleScan}
                disabled={isScanning}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-400 hover:bg-gold-400/20 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Scan className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
                <span className="text-xs hidden sm:inline">{isScanning ? 'Scanning...' : 'Scan Portfolio'}</span>
              </motion.button>
            </>
          )}
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <motion.div 
              className="w-2 h-2 rounded-full bg-gold-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-64 text-dark-400">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-dark-900 border border-gold-400/20 flex items-center justify-center mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <DollarSign className="w-8 h-8 text-gold-400" />
          </motion.div>
          <p className="text-lg">Connect your wallet to view portfolio</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="bg-dark-900/50 rounded-xl p-4 border border-gold-400/10 hover:border-gold-400/30 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gold-400" />
                    </div>
                    <span className="text-xs text-dark-400">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs ${stat.isPositive ? 'text-gold-400' : 'text-red-400'}`}>
                    {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0A0A0F',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FFD700" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  )
}
