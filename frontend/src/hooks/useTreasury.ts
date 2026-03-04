'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ensureSepoliaNetwork,
  getExplorerTxUrl,
  getSignerAddress,
  getTreasuryVaultContract,
  getUsdtBalance,
  parseUsdtAmount,
  TREASURY_VAULT_ADDRESS,
} from '@/lib/contracts'

interface RebalanceArgs {
  reserveWallet: string
  hedgeWallet: string
  yieldWallet: string
  reserveAmount: string
  hedgeAmount: string
  yieldAmount: string
}

interface RebalancedEvent {
  reserveWallet: string
  hedgeWallet: string
  yieldWallet: string
  reserveAmount: string
  hedgeAmount: string
  yieldAmount: string
  txHash?: string
}

export function useTreasury(userAddress?: string) {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userUsdtBalance, setUserUsdtBalance] = useState<number>(0)
  const [vaultUsdtBalance, setVaultUsdtBalance] = useState<number>(0)
  const [lastRebalancedEvent, setLastRebalancedEvent] = useState<RebalancedEvent | null>(null)

  const txExplorerUrl = useMemo(() => (txHash ? getExplorerTxUrl(txHash) : null), [txHash])

  const refreshBalances = useCallback(async () => {
    if (!userAddress) return

    try {
      const [userBal, vaultBal] = await Promise.all([
        getUsdtBalance(userAddress),
        getUsdtBalance(TREASURY_VAULT_ADDRESS),
      ])

      setUserUsdtBalance(userBal)
      setVaultUsdtBalance(vaultBal)
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch balances')
    }
  }, [userAddress])

  const executeRebalance = useCallback(async (args: RebalanceArgs) => {
    setIsExecuting(true)
    setError(null)

    try {
      await ensureSepoliaNetwork()

      const signerAddress = await getSignerAddress()
      if (signerAddress.toLowerCase() !== userAddress?.toLowerCase()) {
        throw new Error('Connected signer mismatch. Reconnect wallet.')
      }

      const contract = await getTreasuryVaultContract(true)
      const tx = await contract.rebalance(
        args.reserveWallet,
        args.hedgeWallet,
        args.yieldWallet,
        parseUsdtAmount(args.reserveAmount),
        parseUsdtAmount(args.hedgeAmount),
        parseUsdtAmount(args.yieldAmount)
      )

      setTxHash(tx.hash)
      await tx.wait()
      await refreshBalances()

      return { success: true as const, txHash: tx.hash }
    } catch (err) {
      const raw = (err as Error).message || 'Rebalance failed'
      const normalized = raw.includes('onlyAgent')
        ? 'Rebalance reverted: connected wallet is not TreasuryVault agent (onlyAgent).'
        : raw.includes('Yield disabled in SAFE mode')
          ? 'Yield deployment disabled while SAFE mode is active.'
          : raw

      setError(normalized)
      return { success: false as const, error: normalized }
    } finally {
      setIsExecuting(false)
    }
  }, [refreshBalances, userAddress])

  useEffect(() => {
    refreshBalances()
  }, [refreshBalances])

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const attach = async () => {
      try {
        const contract = await getTreasuryVaultContract(false)

        const handler = (
          reserveWallet: string,
          hedgeWallet: string,
          yieldWallet: string,
          reserveAmount: bigint,
          hedgeAmount: bigint,
          yieldAmount: bigint,
          event: { log?: { transactionHash?: string } }
        ) => {
          setLastRebalancedEvent({
            reserveWallet,
            hedgeWallet,
            yieldWallet,
            reserveAmount: reserveAmount.toString(),
            hedgeAmount: hedgeAmount.toString(),
            yieldAmount: yieldAmount.toString(),
            txHash: event?.log?.transactionHash,
          })
          refreshBalances()
        }

        contract.on('Rebalanced', handler)
        cleanup = () => {
          contract.off('Rebalanced', handler)
        }
      } catch {
      }
    }

    attach()

    return () => {
      cleanup?.()
    }
  }, [refreshBalances])

  return {
    executeRebalance,
    refreshBalances,
    txHash,
    txExplorerUrl,
    isExecuting,
    error,
    userUsdtBalance,
    vaultUsdtBalance,
    lastRebalancedEvent,
  }
}
