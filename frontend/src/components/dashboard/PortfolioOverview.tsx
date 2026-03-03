'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Percent, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { AutonomousTreasury } from '@/types'

interface PortfolioOverviewProps {
  isConnected: boolean
  treasury: AutonomousTreasury | null
}

const chartData = [
  { date: 'Jan', reserve: 2800, yield: 4700, hedge: 2500 },
  { date: 'Feb', reserve: 3000, yield: 4500, hedge: 2500 },
  { date: 'Mar', reserve: 3200, yield: 4300, hedge: 2500 },
  { date: 'Apr', reserve: 3000, yield: 4600, hedge: 2400 },
  { date: 'May', reserve: 2900, yield: 4800, hedge: 2300 },
  { date: 'Jun', reserve: 3000, yield: 4500, hedge: 2500 },
]

export default function PortfolioOverview({ isConnected, treasury }: PortfolioOverviewProps) {
  const capital = treasury?.capital.deposited ?? 10000
  const usdtReserve = treasury?.capital.usdtReserve ?? 3000
  const xautHedge = treasury?.capital.xautHedge ?? 2500
  const yieldDeployed = treasury?.capital.yieldDeployed ?? 4500

  const stableReservePercent = treasury?.analytics.stableReservePercent ?? 30
  const deployedCapitalPercent = treasury?.analytics.deployedCapitalPercent ?? 70
  const capitalEfficiency = treasury?.analytics.capitalEfficiencyPercent ?? 7.2
  const worstCaseDrawdown = treasury?.analytics.worstCaseDrawdownPercent ?? -6

  const stats = [
    {
      label: 'USD₮ Balance',
      value: `$${usdtReserve.toLocaleString()}`,
      change: `${stableReservePercent}% reserve`,
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'XAU₮ Balance',
      value: `$${xautHedge.toLocaleString()}`,
      change: `${deployedCapitalPercent - 45}% hedge`,
      isPositive: true,
      icon: Activity,
    },
    {
      label: 'Stable Reserve %',
      value: `${stableReservePercent}%`,
      change: `Capital: $${capital.toLocaleString()}`,
      isPositive: true,
      icon: Percent,
    },
    {
      label: 'Risk-Adjusted Yield %',
      value: `${capitalEfficiency.toFixed(1)}%`,
      change: `${worstCaseDrawdown}% worst case`,
      isPositive: capitalEfficiency > 0,
      icon: TrendingUp,
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
          <h2 className="text-xl font-semibold text-white">Treasury Overview</h2>
          <p className="text-sm text-dark-400 mt-1">Autonomous Stable Treasury Agent for USD₮ & XAU₮</p>
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
          <p className="text-lg">Connect wallet to initialize treasury access</p>
        </div>
      ) : (
        <>
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

          <div className="mb-4 rounded-xl bg-dark-900/40 border border-gold-400/10 p-4">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
              <div>
                <p className="text-dark-400 text-xs">USD₮ Reserve</p>
                <p className="text-white font-semibold">${usdtReserve.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-dark-400 text-xs">XAU₮ Hedge</p>
                <p className="text-white font-semibold">${xautHedge.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-dark-400 text-xs">Yield Deployed</p>
                <p className="text-white font-semibold">${yieldDeployed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-dark-400 text-xs">Capital Efficiency</p>
                <p className="text-gold-400 font-semibold">{capitalEfficiency.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-dark-400 text-xs">Worst Case Drawdown</p>
                <p className="text-red-400 font-semibold">{worstCaseDrawdown}%</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-dark-400 mb-2">Treasury Capital Allocation History</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0F',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="reserve" name="Stable Reserve" stroke="#FFD700" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="yield" name="Yield Deployment" stroke="#00FFA3" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hedge" name="Hedge Allocation" stroke="#7C3AED" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
