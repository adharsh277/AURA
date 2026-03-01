'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Bot, 
  Wallet, 
  History, 
  PieChart,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Home,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'

interface DashboardNavbarProps {
  isConnected: boolean
  walletAddress: string
  walletBalance?: number
  onConnect: () => void
  onDisconnect: () => void
}

export default function DashboardNavbar({ isConnected, walletAddress, walletBalance, onConnect, onDisconnect }: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot },
    { id: 'history', label: 'History', icon: History },
  ]

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance?: number) => {
    if (balance === undefined || balance === null) return '...'
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openExplorer = () => {
    window.open(`https://hashscan.io/testnet/account/${walletAddress}`, '_blank')
    setIsDropdownOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-gold-400/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                  <span className="text-dark-950 font-bold text-lg">A</span>
                </div>
                <motion.div 
                  className="absolute -inset-0.5 rounded-xl bg-gold-400/20 blur-sm"
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                <span className="text-white">AU</span>
                <span className="text-gradient">RA</span>
              </span>
            </Link>

            {/* Separator */}
            <div className="hidden sm:block w-px h-6 bg-gold-400/20 mx-2" />

            {/* Back to Home */}
            <Link href="/">
              <motion.div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-gold-400 hover:bg-gold-400/5 transition-all duration-300 cursor-pointer"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20' 
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Network Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-700">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-dark-400">Testnet</span>
            </div>

            {/* Wallet Connect Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isConnected ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 border border-gold-400/20 text-white hover:border-gold-400/40 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">H</span>
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-xs text-dark-400">HashPack</span>
                        <span className="text-sm font-medium text-gold-400">{formatBalance(walletBalance)} HBAR</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-dark-300 hidden lg:inline">{formatAddress(walletAddress)}</span>
                    <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-64 py-2 rounded-xl bg-dark-900 border border-gold-400/10 shadow-xl"
                    >
                      {/* Wallet Info Header */}
                      <div className="px-4 py-3 border-b border-dark-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">H</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">HashPack</p>
                            <p className="text-xs text-dark-400">{walletAddress}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-2 rounded-lg bg-dark-800 flex items-center justify-between">
                          <span className="text-sm text-dark-400">Balance</span>
                          <span className="text-sm font-medium text-gold-400">{formatBalance(walletBalance)} HBAR</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="py-1">
                        <button 
                          onClick={copyAddress}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy Address'}
                        </button>
                        <button 
                          onClick={openExplorer}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Explorer
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>

                      {/* Disconnect */}
                      <div className="border-t border-dark-700 pt-1 mt-1">
                        <button 
                          onClick={() => {
                            onDisconnect()
                            setIsDropdownOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Disconnect Wallet
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.button
                  onClick={onConnect}
                  className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </motion.button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden py-4 border-t border-gold-400/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-gold-400/10 text-gold-400' 
                        : 'text-dark-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}

              {/* Divider */}
              <div className="my-2 border-t border-gold-400/10" />

              {/* Back to Home - Mobile */}
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:text-gold-400 hover:bg-gold-400/5 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Home</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dropdown backdrop */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  )
}
