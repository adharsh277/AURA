'use client'

import { useState } from 'react'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import PortfolioOverview from '@/components/dashboard/PortfolioOverview'
import AIAgentStatus from '@/components/dashboard/AIAgentStatus'
import AssetTable from '@/components/dashboard/AssetTable'
import AIActionsHistory from '@/components/dashboard/AIActionsHistory'
import AIExplainability from '@/components/dashboard/AIExplainability'
import DashboardBackground from '@/components/dashboard/DashboardBackground'

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const handleWalletConnect = async () => {
    setIsWalletConnected(true)
    setWalletAddress('0.0.123456')
  }

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false)
    setWalletAddress('')
  }

  return (
    <main className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Background */}
      <DashboardBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <DashboardNavbar 
          isConnected={isWalletConnected}
          walletAddress={walletAddress}
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
        />
        
        {/* Dashboard Grid */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Portfolio Overview - Takes 2 columns */}
            <div className="xl:col-span-2">
              <PortfolioOverview isConnected={isWalletConnected} />
            </div>
            
            {/* AI Agent Status - Takes 1 column */}
            <div className="xl:col-span-1">
              <AIAgentStatus isConnected={isWalletConnected} />
            </div>
          </div>
          
          {/* Middle Section - AI Explainability */}
          <div className="mb-6">
            <AIExplainability isConnected={isWalletConnected} />
          </div>
          
          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Table */}
            <AssetTable isConnected={isWalletConnected} />
            
            {/* AI Actions History */}
            <AIActionsHistory isConnected={isWalletConnected} />
          </div>
        </div>
      </div>
    </main>
  )
}
