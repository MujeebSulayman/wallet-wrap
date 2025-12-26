'use client'

import { useState, useEffect } from 'react'
import { WalletData } from '@/types'
import { formatEther, formatGwei, shortenAddress, formatNumber } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AudioPlayer from './AudioPlayer'
import Confetti from './Confetti'

interface WrappedDisplayProps {
  data: WalletData
  onReset: () => void
}

const COLORS = ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#4c1d95']

// Chain color mapping
const CHAIN_COLORS: Record<string, string> = {
  'Ethereum': '#627EEA',
  'Polygon': '#8247E5',
  'Arbitrum': '#28A0F0',
  'Optimism': '#FF0420',
  'Base': '#0052FF',
  'zkSync Era': '#8C8DFC',
  'Linea': '#000000',
  'Scroll': '#FFEB3B',
  'Avalanche': '#E84142',
  'BNB Chain': '#F3BA2F',
}

const CHAIN_ICONS: Record<string, string> = {
  'Ethereum': '⟠',
  'Polygon': '⬟',
  'Arbitrum': '🔷',
  'Optimism': '🔴',
  'Base': '🔵',
  'zkSync Era': '⚡',
  'Linea': '◼',
  'Scroll': '📜',
  'Avalanche': '🔺',
  'BNB Chain': '🟡',
}

export default function WrappedDisplay({ data, onReset }: WrappedDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const { stats, address, chains = [], transactions = [], tokenTransfers = [] } = data

  // Calculate chain-specific stats
  const chainStats = chains.reduce((acc, chainName) => {
    const chainTxs = transactions.filter(tx => tx.chain === chainName)
    const chainTokenTransfers = tokenTransfers.filter(tt => tt.chain === chainName)
    
    const chainValueSent = chainTxs
      .filter(tx => tx.from.toLowerCase() === address.toLowerCase())
      .reduce((sum, tx) => sum + BigInt(tx.value || '0'), BigInt(0))
    
    const chainValueReceived = chainTxs
      .filter(tx => tx.to.toLowerCase() === address.toLowerCase())
      .reduce((sum, tx) => sum + BigInt(tx.value || '0'), BigInt(0))
    
    const chainGasSpent = chainTxs
      .reduce((sum, tx) => sum + BigInt(tx.gasUsed || '0') * BigInt(tx.gasPrice || '0'), BigInt(0))
    
    acc[chainName] = {
      transactions: chainTxs.length,
      tokenTransfers: chainTokenTransfers.length,
      valueSent: chainValueSent.toString(),
      valueReceived: chainValueReceived.toString(),
      gasSpent: chainGasSpent.toString(),
      successful: chainTxs.filter(tx => tx.isError === '0').length,
      failed: chainTxs.filter(tx => tx.isError !== '0').length,
    }
    return acc
  }, {} as Record<string, any>)

  // Trigger confetti on slide changes
  useEffect(() => {
    if (currentSlide < 6 && currentSlide > 0) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 500)
      return () => clearTimeout(timer)
    }
  }, [currentSlide])

  const chartData = stats.transactionsByMonth.map((item) => ({
    month: item.month.split(' ')[0],
    count: item.count,
  }))

  const successRate = stats.totalTransactions > 0
    ? ((stats.successfulTransactions / stats.totalTransactions) * 100).toFixed(1)
    : '0'

  const pieData = [
    { name: 'Successful', value: stats.successfulTransactions },
    { name: 'Failed', value: stats.failedTransactions },
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < 6) {
        setCurrentSlide(currentSlide + 1)
      }
    }, 3500)
    return () => clearTimeout(timer)
  }, [currentSlide])

  const slides = [
    // Slide 1: Welcome
    <div key="welcome" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-primary-900/5 pointer-events-none" />
      <div className="relative mb-8 animate-fade-in">
        <div className="mb-6">
          <div className="inline-block w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/30">
            <span className="text-4xl font-black text-white">2025</span>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white tracking-tight">
          Your Wallet Wrapped
        </h1>
        <p className="text-lg text-gray-400 font-mono">{shortenAddress(address, 12)}</p>
      </div>
    </div>,

    // Slide 2: Chains Scanned
    <div key="chains" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-primary-900/5 pointer-events-none" />
      <div className="relative mb-8 animate-fade-in w-full max-w-4xl">
        <p className="text-lg md:text-xl text-gray-400 mb-10 font-light">Scanned across</p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-primary-500 tracking-tight">
          {chains.length} {chains.length === 1 ? 'Chain' : 'Chains'}
        </h1>
        {chains.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {chains.map((chain, index) => {
              const chainColor = CHAIN_COLORS[chain] || '#a855f7'
              const chainIcon = CHAIN_ICONS[chain] || '●'
              return (
                <div
                  key={index}
                  className="px-5 py-2.5 bg-[#0f0f0f] border rounded-xl text-white font-semibold text-sm md:text-base hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    borderColor: `${chainColor}40`,
                    backgroundColor: `${chainColor}10`
                  }}
                >
                  <span className="text-lg">{chainIcon}</span>
                  <span>{chain}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-base text-gray-400 mt-4">No chain data available</p>
        )}
      </div>
    </div>,

    // Slide 3: Total Transactions
    <div key="transactions" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-primary-900/5 pointer-events-none" />
      <div className="relative mb-8 animate-fade-in">
        <p className="text-lg md:text-xl text-gray-400 mb-10 font-light">You made</p>
        <h1 className="text-7xl md:text-9xl font-extrabold mb-6 text-primary-500 tracking-tight">
          {formatNumber(stats.totalTransactions)}
        </h1>
        <p className="text-2xl md:text-3xl font-bold mb-3 text-white">transactions</p>
        <p className="text-base text-gray-400">across {stats.totalDaysActive} active days</p>
      </div>
    </div>,

    // Slide 4: Success Rate
    <div key="success" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-primary-900/5 pointer-events-none" />
      <div className="relative mb-8 animate-fade-in">
        <p className="text-lg md:text-xl text-gray-400 mb-10 font-light">Your success rate</p>
        <h1 className="text-7xl md:text-9xl font-extrabold mb-6 text-primary-500 tracking-tight">
          {successRate}%
        </h1>
        <p className="text-lg text-gray-300">
          {formatNumber(stats.successfulTransactions)} successful transactions
        </p>
      </div>
    </div>,

    // Slide 5: Most Active
    <div key="active" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-primary-900/5 pointer-events-none" />
      <div className="relative mb-8 animate-fade-in">
        <p className="text-lg md:text-xl text-gray-400 mb-10 font-light">Your most active day</p>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary-500 tracking-tight">
          {stats.mostActiveDay}
        </h1>
        <p className="text-base text-gray-400 mt-8">Most active month: {stats.mostActiveMonth}</p>
      </div>
    </div>,

    // Slide 6: Value
    <div key="value" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-primary-900/5 pointer-events-none" />
      <div className="relative mb-8 animate-fade-in">
        <p className="text-lg md:text-xl text-gray-400 mb-10 font-light">You moved</p>
        <h1 className="text-5xl md:text-8xl font-extrabold mb-6 text-primary-500 tracking-tight">
          {formatEther(stats.totalValueSent)}
        </h1>
        <p className="text-2xl md:text-3xl font-bold mb-3 text-white">ETH sent</p>
        <p className="text-base text-gray-400">and received {formatEther(stats.totalValueReceived)} ETH</p>
      </div>
    </div>,

    // Slide 7: Full Stats
    <div key="full" className="min-h-screen py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-12 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    Complete Overview
                  </h2>
                </div>
                <div className="flex items-center gap-4 ml-5">
                  <p className="text-gray-400 font-mono text-sm">{shortenAddress(address, 14)}</p>
                  {chains.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-400 text-sm">{chains.length} {chains.length === 1 ? 'Chain' : 'Chains'}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onReset}
                className="px-6 py-3 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl hover:border-primary-500/50 hover:bg-[#141414] transition-all text-sm font-medium hover:scale-105 active:scale-95 shadow-lg"
              >
                ← New Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Total Transactions"
            value={formatNumber(stats.totalTransactions)}
            subtitle={`${stats.totalDaysActive} active days`}
            delay={0}
            gradient="from-blue-500/20 to-purple-500/20"
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            subtitle={`${formatNumber(stats.successfulTransactions)} successful`}
            delay={100}
            gradient="from-green-500/20 to-emerald-500/20"
          />
          <StatCard
            title="Total Gas Spent"
            value={`${formatEther(stats.totalGasSpent)} ETH`}
            subtitle={`Avg: ${formatGwei(stats.averageGasPrice)} Gwei`}
            delay={200}
            gradient="from-orange-500/20 to-red-500/20"
          />
          <StatCard
            title="Value Sent"
            value={`${formatEther(stats.totalValueSent)} ETH`}
            subtitle="Total outgoing"
            delay={300}
            gradient="from-purple-500/20 to-pink-500/20"
          />
          <StatCard
            title="Value Received"
            value={`${formatEther(stats.totalValueReceived)} ETH`}
            subtitle="Total incoming"
            delay={400}
            gradient="from-cyan-500/20 to-blue-500/20"
          />
          <StatCard
            title="Tokens Interacted"
            value={formatNumber(stats.uniqueTokensInteracted)}
            subtitle={`${formatNumber(stats.uniqueContractsInteracted)} contracts`}
            delay={500}
            gradient="from-indigo-500/20 to-purple-500/20"
          />
        </div>

        {/* Chain Breakdown */}
        {chains.length > 0 && (
          <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Activity by Chain</h3>
                <p className="text-gray-400 text-sm">Breakdown across all scanned networks</p>
              </div>
              <div className="flex gap-2">
                {chains.slice(0, 5).map((chain, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ 
                      backgroundColor: `${CHAIN_COLORS[chain] || '#666'}20`,
                      border: `1px solid ${CHAIN_COLORS[chain] || '#666'}40`
                    }}
                    title={chain}
                  >
                    {CHAIN_ICONS[chain] || '●'}
                  </div>
                ))}
                {chains.length > 5 && (
                  <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center text-xs text-gray-400">
                    +{chains.length - 5}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chains.map((chain, index) => {
                const chainData = chainStats[chain]
                if (!chainData || chainData.transactions === 0) return null
                
                const chainColor = CHAIN_COLORS[chain] || '#a855f7'
                const chainIcon = CHAIN_ICONS[chain] || '●'
                const chainSuccessRate = chainData.transactions > 0
                  ? ((chainData.successful / chainData.transactions) * 100).toFixed(1)
                  : '0'
                
                const activityPercentage = stats.totalTransactions > 0
                  ? ((chainData.transactions / stats.totalTransactions) * 100).toFixed(1)
                  : '0'
                
                return (
                  <div
                    key={chain}
                    className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 hover:border-primary-500/50 transition-all group relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                      style={{ background: `linear-gradient(135deg, ${chainColor}00, ${chainColor}40)` }}
                    />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
                            style={{ 
                              backgroundColor: `${chainColor}20`,
                              border: `2px solid ${chainColor}40`
                            }}
                          >
                            {chainIcon}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">{chain}</h4>
                            <p className="text-xs text-gray-500">{chainData.transactions} txs</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Success Rate</span>
                          <span className="font-semibold text-white">{chainSuccessRate}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Value Sent</span>
                          <span className="font-semibold text-white">{formatEther(chainData.valueSent)} ETH</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Token Transfers</span>
                          <span className="font-semibold text-white">{formatNumber(chainData.tokenTransfers)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Gas Spent</span>
                          <span className="font-semibold text-white">{formatEther(chainData.gasSpent)} ETH</span>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Activity</span>
                          <span>{activityPercentage}%</span>
                        </div>
                        <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${activityPercentage}%`,
                              backgroundColor: chainColor
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Activity Highlights */}
        <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></span>
            Activity Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 hover:border-primary-500/50 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <p className="text-gray-400 text-sm mb-3 font-medium">Most Active Day</p>
                <p className="text-3xl font-bold text-white">{stats.mostActiveDay}</p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 hover:border-primary-500/50 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <p className="text-gray-400 text-sm mb-3 font-medium">Most Active Month</p>
                <p className="text-3xl font-bold text-white">{stats.mostActiveMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></span>
              Transactions by Month
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></span>
              Success vs Failed
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tokens */}
        {stats.topTokens.length > 0 && (
          <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></span>
              Top Tokens
            </h3>
            <div className="space-y-3">
              {stats.topTokens.slice(0, 5).map((token, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 flex items-center justify-between hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/20">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-white">{token.symbol}</p>
                      <p className="text-sm text-gray-400">{formatNumber(token.count)} transfers</p>
                    </div>
                  </div>
                  <p className="font-semibold text-white text-lg">
                    {formatEther(token.value)} tokens
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Contracts */}
        {stats.topContracts.length > 0 && (
          <div className="bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></span>
              Most Interacted Contracts
            </h3>
            <div className="space-y-3">
              {stats.topContracts.slice(0, 5).map((contract, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 flex items-center justify-between hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/20">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-white">{shortenAddress(contract.address, 8)}</p>
                      <p className="text-sm text-gray-400">{formatNumber(contract.count)} interactions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-12 text-gray-500 text-sm border-t border-[#1f1f1f] mt-8">
          <p className="mb-1">Generated for {shortenAddress(address, 20)}</p>
          <p>Wallet Wrapped 2025</p>
        </div>
      </div>
    </div>,
  ]

  return (
    <div className={`relative min-h-screen bg-black ${currentSlide === 6 ? 'overflow-auto' : 'overflow-hidden'}`}>
      {/* Confetti */}
      <Confetti trigger={showConfetti} duration={2000} />
      
      {/* Background Audio */}
      <AudioPlayer autoPlay={true} loop={true} volume={0.2} />

      {/* Slide Navigation */}
      {currentSlide < 6 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
          {slides.slice(0, 6).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === index ? 'bg-primary-500 w-10' : 'bg-gray-700 w-2 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Skip to full view button */}
      {currentSlide < 6 && (
        <button
          onClick={() => setCurrentSlide(6)}
          className="fixed top-8 right-8 z-50 px-5 py-2.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl hover:border-primary-500/50 transition-all text-sm text-gray-300 font-medium"
        >
          View Full Report
        </button>
      )}

      {/* Back button for full stats */}
      {currentSlide === 6 && (
        <button
          onClick={() => setCurrentSlide(0)}
          className="fixed top-8 right-8 z-50 px-5 py-2.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl hover:border-primary-500/50 transition-all text-sm text-gray-300 font-medium"
        >
          ← Back to Slides
        </button>
      )}

      {/* Slides */}
      {currentSlide === 6 ? (
        // Full stats page - render normally for scrolling
        <div className="relative">
          {slides[6]}
        </div>
      ) : (
        // Other slides - use absolute positioning
        <div className="relative">
          {slides.slice(0, 6).map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, subtitle, delay = 0, gradient = '' }: { title: string; value: string; subtitle: string; delay?: number; gradient?: string }) {
  return (
    <div 
      className={`bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 hover:border-primary-500/50 transition-all animate-fade-in group relative overflow-hidden shadow-lg ${gradient ? `bg-gradient-to-br ${gradient}` : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative">
        <p className="text-gray-400 text-sm mb-3 font-medium">{title}</p>
        <p className="text-4xl font-extrabold mb-2 text-white tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{value}</p>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  )
}
