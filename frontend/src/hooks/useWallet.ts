'use client'

import { useState, useCallback, useRef } from 'react'
import { WalletConnection, TokenBalance } from '@/types'

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface UseWalletReturn {
  wallet: WalletConnection | null
  isConnecting: boolean
  error: string | null
  connect: (provider?: 'hashpack' | 'metamask' | 'xverse') => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
  signTransaction: (transactionData: any) => Promise<{ success: boolean; transactionId?: string; error?: string }>
}

// App metadata for HashConnect
const appMetadata = {
  name: 'AURA',
  description: 'AI-Powered Portfolio Manager for Hedera',
  icons: ['https://www.hashpack.app/img/logo.svg'],
  url: typeof window !== 'undefined' ? window.location.origin : 'https://aura.app'
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hashConnectRef = useRef<any>(null)
  const initializingRef = useRef(false)

  // Fetch account balance from Hedera Mirror Node
  const fetchAccountBalance = async (accountId: string): Promise<{ hbar: number; tokens: TokenBalance[] }> => {
    try {
      // Fetch from Hedera Mirror Node (testnet)
      const response = await fetch(
        `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch account data')
      }

      const data = await response.json()
      
      // Convert tinybar to HBAR (1 HBAR = 100,000,000 tinybar)
      const hbarBalance = data.balance?.balance ? data.balance.balance / 100_000_000 : 0

      // Fetch token balances
      const tokensResponse = await fetch(
        `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/tokens`
      )
      
      const tokensData = await tokensResponse.json()
      const tokens: TokenBalance[] = (tokensData.tokens || []).map((token: any) => ({
        tokenId: token.token_id,
        symbol: token.symbol || 'TOKEN',
        name: token.name || 'Unknown Token',
        balance: token.balance || 0,
        decimals: token.decimals || 0
      }))

      const balance = { hbar: hbarBalance, tokens }

      // Update wallet state with new balance
      setWallet(prev => prev ? { ...prev, balance } : null)

      return balance
    } catch (err) {
      console.error('Error fetching balance:', err)
      return { hbar: 0, tokens: [] }
    }
  }

  const connect = useCallback(async (provider: 'hashpack' | 'metamask' | 'xverse' = 'hashpack') => {
    // Only HashPack is supported currently
    if (provider !== 'hashpack') {
      setError(`${provider} wallet is not yet supported. Please use HashPack.`)
      return
    }

    if (initializingRef.current) {
      return
    }

    setIsConnecting(true)
    setError(null)
    initializingRef.current = true

    try {
      // Dynamically import HashConnect to avoid SSR issues
      const { HashConnect, HashConnectConnectionState } = await import('hashconnect')

      // Initialize HashConnect
      const hashConnect = new HashConnect(
        'testnet' as any,
        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '8b64b67a6c8f2d9c5fb8a9e4c3b2a1d0',
        appMetadata,
        true // Enable debug mode
      )

      hashConnectRef.current = hashConnect

      // Set up event listeners
      hashConnect.pairingEvent.on((pairingData: any) => {
        console.log('Pairing event:', pairingData)
      })

      hashConnect.connectionStatusChangeEvent.on((state: any) => {
        console.log('Connection state changed:', state)
        
        if (state === HashConnectConnectionState.Paired) {
          // Get connected account info
          const connectedAccountIds = hashConnect.connectedAccountIds
          
          if (connectedAccountIds && connectedAccountIds.length > 0) {
            const accountId = connectedAccountIds[0]
            console.log('Connected to account:', accountId)
            
            // Fetch balance and set wallet
            fetchAccountBalance(accountId).then((balance) => {
              const walletData: WalletConnection = {
                isConnected: true,
                accountId: accountId,
                network: 'testnet',
                provider: 'hashpack',
                balance
              }
              setWallet(walletData)
              setIsConnecting(false)
              initializingRef.current = false
            })
          }
        } else if (state === HashConnectConnectionState.Disconnected) {
          setWallet(null)
          setIsConnecting(false)
          initializingRef.current = false
        }
      })

      // Initialize and open pairing modal
      await hashConnect.init()
      
      // Open the HashPack extension/modal for pairing
      await hashConnect.openPairingModal()

    } catch (err) {
      console.error('HashConnect error:', err)
      setError((err as Error).message || 'Failed to connect to HashPack. Please make sure HashPack extension is installed.')
      setIsConnecting(false)
      initializingRef.current = false
    }
  }, [])

  const disconnect = useCallback(() => {
    if (hashConnectRef.current) {
      try {
        hashConnectRef.current.disconnect()
      } catch (e) {
        console.error('Disconnect error:', e)
      }
      hashConnectRef.current = null
    }
    setWallet(null)
    setError(null)
    initializingRef.current = false
  }, [])

  const refreshBalance = useCallback(async () => {
    if (wallet?.accountId) {
      await fetchAccountBalance(wallet.accountId)
    }
  }, [wallet?.accountId])

  const signTransaction = useCallback(async (transactionData: any): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    if (!wallet?.isConnected) {
      return { success: false, error: 'Wallet not connected' }
    }

    if (!hashConnectRef.current) {
      return { success: false, error: 'HashConnect not initialized' }
    }

    try {
      // For demo, we prepare the transaction on the backend
      const response = await fetch(`${API_BASE}/api/hedera/prepare-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: wallet.accountId,
          ...transactionData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to prepare transaction')
      }

      const { transaction } = await response.json()

      // In a full implementation, we would sign the transaction with HashConnect:
      // const signResult = await hashConnectRef.current.sendTransaction(
      //   wallet.accountId,
      //   transactionBytes
      // )

      // For now, return the mock transaction ID
      const mockTxId = transaction.transactionId

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
