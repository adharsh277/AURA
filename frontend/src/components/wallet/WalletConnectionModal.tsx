'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, ExternalLink, AlertCircle, Check, Loader2 } from 'lucide-react'

interface WalletOption {
  id: 'hashpack' | 'metamask' | 'xverse'
  name: string
  description: string
  icon: string
  status: 'available' | 'coming-soon'
  statusText?: string
}

const walletOptions: WalletOption[] = [
  {
    id: 'hashpack',
    name: 'HashPack',
    description: 'Hedera Native Wallet',
    icon: '🟣',
    status: 'available'
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'EVM Compatible',
    icon: '🦊',
    status: 'coming-soon',
    statusText: 'Coming Soon'
  },
  {
    id: 'xverse',
    name: 'Xverse',
    description: 'Bitcoin Escrow Mode',
    icon: '₿',
    status: 'coming-soon',
    statusText: 'Coming Soon'
  }
]

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (provider: 'hashpack' | 'metamask' | 'xverse') => Promise<void>
  isConnecting: boolean
  error: string | null
}

export default function WalletConnectionModal({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  error
}: WalletConnectionModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [connectionStep, setConnectionStep] = useState<'select' | 'connecting' | 'success'>('select')

  const handleWalletSelect = async (wallet: WalletOption) => {
    if (wallet.status === 'coming-soon') return
    
    setSelectedWallet(wallet.id)
    setConnectionStep('connecting')
    
    try {
      await onConnect(wallet.id)
      setConnectionStep('success')
      setTimeout(() => {
        onClose()
        setConnectionStep('select')
        setSelectedWallet(null)
      }, 1500)
    } catch (err) {
      setConnectionStep('select')
    }
  }

  const handleClose = () => {
    if (!isConnecting) {
      onClose()
      setConnectionStep('select')
      setSelectedWallet(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-4 top-20 w-full max-w-sm z-50"
          >
            <div className="bg-dark-900 border border-gold-400/20 rounded-2xl shadow-2xl overflow-hidden mx-4 sm:mx-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gold-400/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-dark-950" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Connect Wallet</h2>
                    <p className="text-xs text-dark-400">Choose your preferred wallet</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isConnecting}
                  className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {connectionStep === 'select' && (
                  <div className="space-y-2">
                    {walletOptions.map((wallet) => (
                      <motion.button
                        key={wallet.id}
                        onClick={() => handleWalletSelect(wallet)}
                        disabled={wallet.status === 'coming-soon'}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                          wallet.status === 'available'
                            ? 'border-dark-700 hover:border-gold-400/40 hover:bg-gold-400/5 cursor-pointer'
                            : 'border-dark-800 bg-dark-800/30 cursor-not-allowed opacity-60'
                        }`}
                        whileHover={wallet.status === 'available' ? { scale: 1.01 } : {}}
                        whileTap={wallet.status === 'available' ? { scale: 0.99 } : {}}
                      >
                        <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl">
                          {wallet.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white text-sm">{wallet.name}</span>
                            {wallet.status === 'available' && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-green-400/10 text-green-400 border border-green-400/20">
                                Recommended
                              </span>
                            )}
                            {wallet.status === 'coming-soon' && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-dark-700 text-dark-400 border border-dark-600">
                                {wallet.statusText}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-dark-400">{wallet.description}</p>
                        </div>
                        {wallet.status === 'available' && (
                          <ExternalLink className="w-3 h-3 text-dark-500" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}

                {connectionStep === 'connecting' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="relative">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gold-400/20 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
                      </motion.div>
                    </div>
                    <h3 className="text-base font-medium text-white mt-4">Connecting to HashPack</h3>
                    <p className="text-xs text-dark-400 mt-1 text-center">
                      Approve the connection in your wallet
                    </p>
                  </motion.div>
                )}

                {connectionStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-base font-medium text-white mt-4">Connected!</h3>
                    <p className="text-xs text-dark-400 mt-1">Redirecting...</p>
                  </motion.div>
                )}

                {error && connectionStep === 'select' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/20"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-red-400">Connection Failed</p>
                      <p className="text-xs text-red-400/80">{error}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-dark-800/50 border border-dark-700">
                  <div className="flex items-start gap-2">
                    <span className="text-gold-400 text-sm">🔐</span>
                    <div>
                      <p className="text-xs font-medium text-white">Secure Connection</p>
                      <p className="text-[10px] text-dark-400 mt-0.5">
                        AURA never stores your private keys.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
