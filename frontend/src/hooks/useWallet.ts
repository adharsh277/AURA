'use client'

import { useState, useCallback } from 'react'
import { WalletConnection } from '@/types'

interface UseWalletReturn {
  wallet: WalletConnection | null
  isConnecting: boolean
  error: string | null
  connect: (provider?: 'hashpack' | 'metamask' | 'walletconnect') => Promise<void>
  disconnect: () => void
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async (provider: 'hashpack' | 'metamask' | 'walletconnect' = 'hashpack') => {
    setIsConnecting(true)
    setError(null)

    try {
      // In production, integrate with actual wallet providers
      // This is a mock implementation for demonstration
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate connection delay

      // Mock successful connection
      setWallet({
        isConnected: true,
        accountId: '0.0.123456',
        network: 'testnet',
        provider
      })
    } catch (err) {
      setError((err as Error).message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet(null)
    setError(null)
  }, [])

  return {
    wallet,
    isConnecting,
    error,
    connect,
    disconnect
  }
}
