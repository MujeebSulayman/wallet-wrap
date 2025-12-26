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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 mx-auto shadow-lg shadow-primary-500/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
            Wallet Wrapped
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Discover your blockchain journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-mono text-sm"
                disabled={loading}
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-950/30 border border-red-900/30 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/20 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing your wallet...
                </span>
              ) : (
                'Generate Wrapped'
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Your data is processed securely and privately
          </p>
        </div>
      </div>
    </div>
  )
}
