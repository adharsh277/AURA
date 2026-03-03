'use client'

import { useEffect, useState } from 'react'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import PortfolioOverview from '@/components/dashboard/PortfolioOverview'
import AIAgentStatus from '@/components/dashboard/AIAgentStatus'
import AssetTable from '@/components/dashboard/AssetTable'
import AIActionsHistory from '@/components/dashboard/AIActionsHistory'
import AIExplainability from '@/components/dashboard/AIExplainability'
import DashboardBackground from '@/components/dashboard/DashboardBackground'
import WalletConnectionModal from '@/components/wallet/WalletConnectionModal'
import { useWallet } from '@/hooks/useWallet'
import { AutonomousTreasury } from '@/types'

export default function Dashboard() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [treasury, setTreasury] = useState<AutonomousTreasury | null>(null)
  const [isCreatingTreasury, setIsCreatingTreasury] = useState(false)
  const [treasuryError, setTreasuryError] = useState<string | null>(null)
  const { wallet, isConnecting, error, connect, disconnect, signTransaction } = useWallet()

  const handleWalletConnect = () => {
    setIsWalletModalOpen(true)
  }

  const handleConnect = async (provider: 'metamask' | 'xverse') => {
    await connect(provider)
  }

  const handleWalletDisconnect = () => {
    disconnect()
  }

  useEffect(() => {
    const loadTreasury = async () => {
      try {
        const response = await fetch('/api/agent/treasury/status')
        if (!response.ok) {
          return
        }

        const data = await response.json()
        setTreasury(data.treasury || null)
      } catch (_err) {
      }
    }

    loadTreasury()
  }, [])

  const createAutonomousTreasury = async () => {
    setIsCreatingTreasury(true)
    setTreasuryError(null)

    try {
      const response = await fetch('/api/agent/treasury/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userWalletAccountId: wallet?.accountId || null,
          depositAmount: 10000
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to create treasury' }))
        throw new Error(data.error || 'Failed to create treasury')
      }

      const data = await response.json()
      setTreasury(data.treasury)
    } catch (err) {
      setTreasuryError((err as Error).message)
    } finally {
      setIsCreatingTreasury(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Background */}
      <DashboardBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <DashboardNavbar 
          isConnected={wallet?.isConnected || false}
          walletAddress={wallet?.accountId || ''}
          walletBalance={wallet?.balance?.hbar}
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
        />
        
        {/* Wallet Connection Modal */}
        <WalletConnectionModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          onConnect={handleConnect}
          isConnecting={isConnecting}
          error={error}
        />
        
        {/* Dashboard Grid */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Treasury Overview - Takes 2 columns */}
            <div className="xl:col-span-2">
              <PortfolioOverview 
                isConnected={wallet?.isConnected || false}
                treasury={treasury}
              />
            </div>
            
            {/* AI Agent Status - Takes 1 column */}
            <div className="xl:col-span-1">
              <AIAgentStatus
                isConnected={wallet?.isConnected || false}
                userWalletAddress={wallet?.accountId || null}
                treasury={treasury}
                isCreatingTreasury={isCreatingTreasury}
                treasuryError={treasuryError}
                onCreateTreasury={createAutonomousTreasury}
              />
            </div>
          </div>
          
          {/* Middle Section - AI Explainability */}
          <div className="mb-6">
            <AIExplainability 
              isConnected={wallet?.isConnected || false}
              accountId={wallet?.accountId}
              onExecute={signTransaction}
            />
          </div>
          
          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Table */}
            <AssetTable 
              isConnected={wallet?.isConnected || false}
              treasury={treasury}
            />
            
            {/* AI Actions History */}
            <AIActionsHistory isConnected={wallet?.isConnected || false} />
          </div>
        </div>
      </div>
    </main>
  )
}
