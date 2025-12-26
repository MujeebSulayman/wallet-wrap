'use client'

import { useState } from 'react'
import WalletInput from '@/components/WalletInput'
import WrappedDisplay from '@/components/WrappedDisplay'
import Confetti from '@/components/Confetti'
import { WalletData } from '@/types'

export default function Home() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleFetchData = async (address: string) => {
    setLoading(true)
    setError(null)
    setWalletData(null)
    setShowConfetti(false)

    try {
      // Automatically fetch from all enabled chains
      const response = await fetch(`/api/wallet?address=${address}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch wallet data')
      }
      const data = await response.json()
      
      // Check if we got any data
      if (data.stats.totalTransactions === 0 && data.transactions.length === 0) {
        console.warn('No transactions found. This could mean:')
        console.warn('1. The wallet has no activity')
        console.warn('2. API rate limits or errors')
        console.warn('3. The wallet address has no activity on selected chains')
      } else {
        // Show confetti when data is loaded
        setShowConfetti(true)
      }
      
      setWalletData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <Confetti trigger={showConfetti} />
      
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-950/20 via-black to-primary-950/10 pointer-events-none" />
      
      {!walletData ? (
        <WalletInput 
          onFetch={handleFetchData} 
          loading={loading}
          error={error}
        />
      ) : (
        <WrappedDisplay 
          data={walletData} 
          onReset={() => {
            setWalletData(null)
            setShowConfetti(false)
          }}
        />
      )}
    </main>
  )
}
