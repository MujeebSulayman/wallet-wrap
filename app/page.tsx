'use client'

import { useState } from 'react'
import WalletInput from '@/components/WalletInput'
import WrappedDisplay from '@/components/WrappedDisplay'
import { WalletData } from '@/types'

export default function Home() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFetchData = async (address: string) => {
    setLoading(true)
    setError(null)
    setWalletData(null)

    try {
      const response = await fetch(`/api/wallet?address=${address}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch wallet data')
      }
      const data = await response.json()
      
      // Check if we got any data
      if (data.stats.totalTransactions === 0 && data.transactions.length === 0) {
        console.warn('No transactions found. This could mean:')
        console.warn('1. The wallet has no activity in 2025')
        console.warn('2. API rate limits or errors')
        console.warn('3. The wallet address has no activity on any chain')
      }
      
      setWalletData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {!walletData ? (
        <WalletInput 
          onFetch={handleFetchData} 
          loading={loading}
          error={error}
        />
      ) : (
        <WrappedDisplay 
          data={walletData} 
          onReset={() => setWalletData(null)}
        />
      )}
    </main>
  )
}
