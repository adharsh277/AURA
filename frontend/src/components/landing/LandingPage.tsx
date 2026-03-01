'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, TrendingUp, Brain, Zap, ChevronRight, Play } from 'lucide-react'
import BlockchainBackground from './BlockchainBackground'

const features = [
  {
    icon: Brain,
    title: 'Autonomous AI Agent',
    description: 'Self-learning AI that makes intelligent trading decisions 24/7 without human intervention.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Optimization',
    description: 'Maximize yield while minimizing risk through advanced portfolio rebalancing algorithms.',
  },
  {
    icon: Shield,
    title: 'Risk Protection',
    description: 'Automatic stop-loss triggers and real-time volatility monitoring to protect your assets.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Hedera for sub-second finality and minimal transaction costs.',
  },
]

const stats = [
  { value: '$2.4M+', label: 'Assets Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<3s', label: 'Avg Response' },
  { value: '24/7', label: 'AI Monitoring' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Blockchain Background Animation */}
      <BlockchainBackground />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 radial-glow pointer-events-none" />
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                <span className="text-dark-950 font-bold text-xl">A</span>
              </div>
              <motion.div 
                className="absolute -inset-1 rounded-xl bg-gold-400/20 blur-sm"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">AU</span>
              <span className="text-gradient">RA</span>
            </span>
          </motion.div>

          {/* Nav Links - Desktop */}
          <motion.div 
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {['Features', 'How it Works', 'Pricing', 'Docs'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="text-sm text-dark-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/dashboard"
              className="hidden sm:block text-sm text-dark-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard"
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-gold-400 font-medium">Powered by Hedera Hashgraph</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              >
                <span className="text-white">Your Portfolio,</span>
                <br />
                <span className="text-gradient">Autonomously</span>
                <br />
                <span className="text-white">Optimized</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg lg:text-xl text-dark-400 leading-relaxed mb-10 max-w-xl"
              >
                AURA is an AI agent that autonomously manages, optimizes, and protects your crypto portfolio on Hedera — 24/7, without human intervention.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link 
                  href="/dashboard"
                  className="btn-primary px-8 py-4 text-base flex items-center justify-center gap-3 group"
                >
                  Start Managing Portfolio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn-secondary px-8 py-4 text-base flex items-center justify-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-dark-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-10 bg-gradient-radial from-gold-400/20 via-gold-500/5 to-transparent blur-3xl" />
                
                {/* Main Card */}
                <div className="relative glass-card-premium p-8 rounded-3xl">
                  {/* AI Status */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-dark-950" />
                        </div>
                        <motion.div
                          className="absolute -inset-1 rounded-2xl bg-gold-400/30"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <div>
                        <div className="text-white font-semibold">AI Agent</div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-green-400">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-dark-400">Confidence</div>
                      <div className="text-xl font-bold text-gradient">94.7%</div>
                    </div>
                  </div>

                  {/* Portfolio Value */}
                  <div className="mb-6">
                    <div className="text-sm text-dark-400 mb-1">Portfolio Value</div>
                    <div className="text-4xl font-bold text-white mb-2">$128,459.32</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-sm font-medium">
                        +12.4%
                      </span>
                      <span className="text-sm text-dark-500">Last 30 days</span>
                    </div>
                  </div>

                  {/* Mini Chart Placeholder */}
                  <div className="h-32 mb-6 rounded-xl bg-dark-950/50 border border-gold-400/10 flex items-end p-4 gap-1">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 85, 100, 75, 88].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-gold-500 to-gold-400 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </div>

                  {/* Recent Action */}
                  <div className="p-4 rounded-xl bg-dark-950/50 border border-gold-400/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">Optimized Position</div>
                          <div className="text-dark-500 text-xs">Staked 5,000 HBAR</div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">+8.5% APY</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -right-8 top-20 glass-card p-4 rounded-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-gold-400" />
                    <div>
                      <div className="text-white font-semibold text-sm">Protected</div>
                      <div className="text-dark-500 text-xs">Stop-loss active</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-8 bottom-20 glass-card p-4 rounded-xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-gold-400" />
                    <div>
                      <div className="text-white font-semibold text-sm">Fast Execution</div>
                      <div className="text-dark-500 text-xs">~2s on Hedera</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 mb-6"
            >
              <span className="text-sm text-gold-400 font-medium">Core Features</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl lg:text-5xl font-bold text-white mb-6"
            >
              Everything You Need for
              <br />
              <span className="text-gradient">Autonomous Portfolio Management</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-dark-400 max-w-2xl mx-auto"
            >
              AURA combines cutting-edge AI with the speed and security of Hedera to deliver a truly autonomous trading experience.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="feature-card glass-card p-8 rounded-2xl group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card-premium p-12 lg:p-16 rounded-3xl text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 via-transparent to-transparent" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Let AI Manage Your Portfolio?
              </h2>
              <p className="text-lg text-dark-400 mb-10 max-w-xl mx-auto">
                Join the future of autonomous portfolio management. Connect your wallet and let AURA optimize your crypto investments.
              </p>
              <Link 
                href="/dashboard"
                className="btn-primary px-10 py-4 text-base inline-flex items-center gap-3 group"
              >
                Launch Dashboard
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-dark-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="text-dark-950 font-bold">A</span>
            </div>
            <span className="text-white font-semibold">AURA</span>
          </div>
          <div className="text-sm text-dark-500">
            © 2026 AURA. Built on Hedera Hashgraph.
          </div>
          <div className="flex items-center gap-6">
            {['Twitter', 'Discord', 'GitHub'].map((social) => (
              <a key={social} href="#" className="text-sm text-dark-500 hover:text-gold-400 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
