'use client'

import { useState, useCallback } from 'react'
import { BrowserProvider, formatEther } from 'ethers'
import { WalletConnection, TokenBalance } from '@/types'
import { SEPOLIA_CHAIN_ID_HEX } from '@/lib/contracts'

interface UseWalletReturn {
  wallet: WalletConnection | null
  isConnecting: boolean
  error: string | null
  connect: (provider?: 'metamask' | 'xverse') => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
  signTransaction: (transactionData: any) => Promise<{ success: boolean; transactionId?: string; error?: string }>
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    }
  }
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async (provider: 'metamask' | 'xverse' = 'metamask') => {
    if (provider === 'xverse') {
      setError('Xverse integration is not enabled yet. Please use MetaMask.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed.')
      }

      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts'
      })) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error('No MetaMask account available')
      }

      const accountId = accounts[0]

      const chainId = (await window.ethereum.request({ method: 'eth_chainId' })) as string
      if (chainId?.toLowerCase() !== SEPOLIA_CHAIN_ID_HEX) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
        })
      }

      const providerObj = new BrowserProvider(window.ethereum as any)
      const balanceWei = await providerObj.getBalance(accountId)
      const ethBalance = Number(formatEther(balanceWei))

      const balance: { hbar: number; tokens: TokenBalance[] } = {
        hbar: ethBalance,
        tokens: []
      }

      const walletData: WalletConnection = {
        isConnected: true,
        accountId,
        network: 'testnet',
        provider: 'metamask',
        balance
      }

      setWallet(walletData)
    } catch (err) {
      setError((err as Error).message || 'Failed to connect MetaMask')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet(null)
    setError(null)
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!wallet?.accountId || typeof window === 'undefined' || !window.ethereum) {
      return
    }

    const providerObj = new BrowserProvider(window.ethereum as any)
    const balanceWei = await providerObj.getBalance(wallet.accountId)
    const ethBalance = Number(formatEther(balanceWei))

    setWallet(prev => prev ? {
      ...prev,
      balance: {
        hbar: ethBalance,
        tokens: prev.balance?.tokens || []
      }
    } : null)
  }, [wallet?.accountId])

  const signTransaction = useCallback(async (transactionData: any): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    if (!wallet?.isConnected) {
      return { success: false, error: 'Wallet not connected' }
    }

    try {
      const randomId = Math.random().toString(36).slice(2, 10)
      const mockTxId = `decision-${Date.now()}-${randomId}`

      // Refresh balance after transaction
      await refreshBalance()

      return {
        success: true,
        transactionId: mockTxId
      }
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message || 'Transaction failed'
      }
    }
  }, [wallet, refreshBalance])

  return {
    wallet,
    isConnecting,
    error,
    connect,
    disconnect,
    refreshBalance,
    signTransaction
  }
}
