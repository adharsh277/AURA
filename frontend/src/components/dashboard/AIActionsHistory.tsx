'use client'

import { motion } from 'framer-motion'
import { Bot, ArrowRightLeft, TrendingUp, Shield, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'

interface AIActionsHistoryProps {
  isConnected: boolean
}

const actions = [
  {
    id: 1,
    type: 'swap',
    action: 'Swapped 1,000 USDC to HBAR',
    reason: 'HBAR undervalued - bullish momentum detected',
    status: 'completed',
    timestamp: '2 min ago',
    profit: '+$45.20'
  },
  {
    id: 2,
    type: 'stake',
    action: 'Staked 5,000 HBAR',
    reason: 'High yield opportunity on SaucerSwap',
    status: 'completed',
    timestamp: '15 min ago',
    profit: '+8.5% APY'
  },
  {
    id: 3,
    type: 'protect',
    action: 'Set stop-loss on SAUCE',
    reason: 'Volatility spike detected',
    status: 'active',
    timestamp: '1 hour ago',
    profit: 'Protected'
  },
  {
    id: 4,
    type: 'rebalance',
    action: 'Rebalanced portfolio',
    reason: 'Risk level exceeded threshold',
    status: 'completed',
    timestamp: '3 hours ago',
    profit: '-0.5% fees'
  },
  {
    id: 5,
    type: 'swap',
    action: 'Sold 2,000 SAUCE',
    reason: 'Profit target reached',
    status: 'completed',
    timestamp: '1 day ago',
    profit: '+$234.50'
  },
]

const getActionIcon = (type: string) => {
  switch (type) {
    case 'swap': return ArrowRightLeft
    case 'stake': return TrendingUp
    case 'protect': return Shield
    case 'rebalance': return Bot
    default: return Bot
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-gold-400" />
    case 'active': return <Loader className="w-4 h-4 text-gold-500 animate-spin" />
    case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
    default: return <Clock className="w-4 h-4 text-dark-400" />
  }
}

export default function AIActionsHistory({ isConnected }: AIActionsHistoryProps) {
  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Actions</h2>
        <motion.button
          className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          View All
        </motion.button>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-48 text-dark-400">
          <Bot className="w-12 h-12 mb-3 text-dark-600" />
          <p>Connect wallet to view AI actions</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {actions.map((action, index) => {
            const Icon = getActionIcon(action.type)
            return (
              <motion.div
                key={action.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-dark-900/50 border border-gold-400/10 hover:border-gold-400/30 transition-all cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">{action.action}</p>
                    {getStatusIcon(action.status)}
                  </div>
                  <p className="text-xs text-dark-400 mb-1 truncate">{action.reason}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-dark-500">{action.timestamp}</span>
                    <span className={`${action.profit.startsWith('+') ? 'text-gold-400' : action.profit.startsWith('-') ? 'text-red-400' : 'text-gold-500'}`}>
                      {action.profit}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
