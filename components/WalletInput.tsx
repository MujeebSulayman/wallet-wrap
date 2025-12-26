'use client'

import { useState } from 'react'

interface WalletInputProps {
  onFetch: (address: string) => void
  loading: boolean
  error: string | null
}

export default function WalletInput({ onFetch, loading, error }: WalletInputProps) {
  const [address, setAddress] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onFetch(address.trim())
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Wallet Wrapped
          </h1>
          <p className="text-gray-400 text-lg">
            Your 2025 blockchain story
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="bg-red-950/50 border border-red-900/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold rounded-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning all chains...
              </span>
            ) : (
              'Generate Wrapped'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center">
          Automatically scans Ethereum and all major L2s
        </p>
      </div>
    </div>
  )
}
