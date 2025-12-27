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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/30 via-black to-primary-950/20 pointer-events-none" />
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30 mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            Wallet Wrapped
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-light mb-2">
            Your Blockchain Journey
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Discover your complete on-chain activity across Ethereum and all major L2 networks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 hover:border-primary-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Multi-Chain</h3>
              </div>
              <p className="text-sm text-gray-400">Scans Ethereum, Polygon, Arbitrum, Base, and more</p>
            </div>

            <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 hover:border-primary-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Analytics</h3>
              </div>
              <p className="text-sm text-gray-400">Comprehensive stats, charts, and insights</p>
            </div>

            <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 hover:border-primary-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Secure</h3>
              </div>
              <p className="text-sm text-gray-400">Your data is processed securely and privately</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Enter Your Wallet Address</h2>
                  <p className="text-gray-400 text-sm">Get started by entering your Ethereum wallet address</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Wallet Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="0x4f950FAA97B1A7fad9C78cA03B1e99539C8E5cf3"
                        className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-mono text-sm"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-950/30 border border-red-900/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || !address.trim()}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 hover:from-primary-700 hover:via-primary-700 hover:to-primary-800 disabled:from-gray-800 disabled:via-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/30 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing your wallet...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate Wrapped</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#1f1f1f]">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Your data is processed securely and privately</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Powered by Etherscan API • Supports 10+ EVM chains
          </p>
        </div>
      </div>
    </div>
  )
}
