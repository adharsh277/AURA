'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Zap, Shield, TrendingUp, Play, Pause, Settings } from 'lucide-react'

interface AIAgentStatusProps {
  isConnected: boolean
}

export default function AIAgentStatus({ isConnected }: AIAgentStatusProps) {
  const [isAgentActive, setIsAgentActive] = useState(true)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  const agentMetrics = [
    { label: 'Risk Level', value: 'Medium', color: 'text-amber-400' },
    { label: 'Strategy', value: 'Growth', color: 'text-gold-400' },
    { label: 'Status', value: isAgentActive ? 'Active' : 'Paused', color: isAgentActive ? 'text-gold-400' : 'text-dark-400' },
  ]

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

      {/* AI Orb Visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Outer Pulse Rings */}
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
          
          {/* Main Orb */}
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
            {/* Inner Glow */}
            <div className="absolute inset-2 rounded-full bg-dark-950/80 flex items-center justify-center">
              <motion.div
                animate={isScanning ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
              >
                <Bot className={`w-10 h-10 ${isConnected ? 'text-gold-400' : 'text-dark-500'}`} />
              </motion.div>
            </div>
            
            {/* Neural Pattern Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.line
                  key={i}
                  x1="56"
                  y1="56"
                  x2={56 + 45 * Math.cos((angle * Math.PI) / 180)}
                  y2={56 + 45 * Math.sin((angle * Math.PI) / 180)}
                  stroke={isConnected ? 'rgba(255, 215, 0, 0.3)' : 'rgba(100, 100, 100, 0.2)'}
                  strokeWidth="1"
                  className={isAgentActive && isConnected ? 'neural-line' : ''}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="space-y-3 mb-6">
        {agentMetrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between py-2 border-b border-gold-400/10">
            <span className="text-sm text-gray-400">{metric.label}</span>
            <span className={`text-sm font-medium ${metric.color}`}>{metric.value}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
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

      {/* Scan Button */}
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
        {/* Pulse Animation Around Button */}
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
          <span>{isScanning ? 'Scanning Portfolio...' : 'Scan & Optimize'}</span>
        </div>
      </motion.button>
    </motion.div>
  )
}
