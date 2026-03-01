'use client'

import { useState } from 'react'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import PortfolioOverview from '@/components/dashboard/PortfolioOverview'
import AIAgentStatus from '@/components/dashboard/AIAgentStatus'
import AssetTable from '@/components/dashboard/AssetTable'
import AIActionsHistory from '@/components/dashboard/AIActionsHistory'
import AIExplainability from '@/components/dashboard/AIExplainability'
import DashboardBackground from '@/components/dashboard/DashboardBackground'
import WalletConnectionModal from '@/components/wallet/WalletConnectionModal'
import { useWallet } from '@/hooks/useWallet'

export default function Dashboard() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const { wallet, isConnecting, error, connect, disconnect, refreshBalance, signTransaction } = useWallet()

  const handleWalletConnect = () => {
    setIsWalletModalOpen(true)
  }

  const handleConnect = async (provider: 'hashpack' | 'metamask' | 'xverse') => {
    await connect(provider)
  }

  const handleWalletDisconnect = () => {
    disconnect()
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
            {/* Portfolio Overview - Takes 2 columns */}
            <div className="xl:col-span-2">
              <PortfolioOverview 
                isConnected={wallet?.isConnected || false} 
                accountId={wallet?.accountId}
                walletBalance={wallet?.balance}
                onRefresh={refreshBalance}
              />
            </div>
            
            {/* AI Agent Status - Takes 1 column */}
            <div className="xl:col-span-1">
              <AIAgentStatus isConnected={wallet?.isConnected || false} />
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
              walletBalance={wallet?.balance}
            />
            
            {/* AI Actions History */}
            <AIActionsHistory isConnected={wallet?.isConnected || false} />
          </div>
        </div>
      </div>
    </main>
  )
}
