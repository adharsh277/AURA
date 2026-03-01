'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Percent, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface PortfolioOverviewProps {
  isConnected: boolean
}

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

const stats = [
  { 
    label: 'Total Balance', 
    value: '$28,542.85', 
    change: '+12.5%', 
    isPositive: true,
    icon: DollarSign 
  },
  { 
    label: '24h Change', 
    value: '+$1,234.56', 
    change: '+4.5%', 
    isPositive: true,
    icon: TrendingUp 
  },
  { 
    label: 'Total Yield', 
    value: '8.2% APY', 
    change: '+0.3%', 
    isPositive: true,
    icon: Percent 
  },
  { 
    label: 'AI Trades', 
    value: '24', 
    change: 'This week', 
    isPositive: true,
    icon: Activity 
  },
]

export default function PortfolioOverview({ isConnected }: PortfolioOverviewProps) {
  return (
    <motion.div 
      className="glass-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Portfolio Overview</h2>
        <div className="flex items-center gap-2 text-sm text-dark-400">
          <span>Last updated: Just now</span>
          <motion.div 
            className="w-2 h-2 rounded-full bg-gold-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
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
