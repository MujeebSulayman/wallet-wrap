'use client'

import { useState, useEffect } from 'react'
import { WalletData } from '@/types'
import { formatEther, formatGwei, shortenAddress, formatNumber } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AudioPlayer from './AudioPlayer'

interface WrappedDisplayProps {
  data: WalletData
  onReset: () => void
}

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#1e40af']

export default function WrappedDisplay({ data, onReset }: WrappedDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { stats, address, chains = [] } = data

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

  // Chain breakdown
  const chainBreakdown = (chains || []).reduce((acc, chain) => {
    const chainTxs = (data.transactions || []).filter((tx) => tx.chain === chain).length
    const chainTokens = (data.tokenTransfers || []).filter((tt) => tt.chain === chain).length
    acc[chain] = { transactions: chainTxs, tokens: chainTokens }
    return acc
  }, {} as Record<string, { transactions: number; tokens: number }>)

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < 5) {
        setCurrentSlide(currentSlide + 1)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [currentSlide])

  const slides = [
    // Slide 1: Welcome
    <div key="welcome" className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-8xl md:text-9xl font-black mb-6 text-primary-500">2025</h1>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Your Wallet Wrapped</h2>
        <p className="text-sm text-gray-500 mt-2">Showing all transactions, stats filtered for 2025</p>
        <p className="text-xl text-gray-400 font-mono">{shortenAddress(address, 10)}</p>
      </div>
      {chains.length > 0 && (
        <div className="text-gray-500 text-sm animate-slide-up">
          <p>Scanned {chains.length} chain{chains.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>,

    // Slide 2: Total Transactions
    <div key="transactions" className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 animate-fade-in">
        <p className="text-xl md:text-2xl text-gray-400 mb-8">You made</p>
        <h1 className="text-8xl md:text-9xl font-black mb-6 text-primary-500">
          {formatNumber(stats.totalTransactions)}
        </h1>
        <p className="text-2xl md:text-3xl font-bold mb-4 text-white">transactions</p>
        <p className="text-lg text-gray-400">across {stats.totalDaysActive} active days</p>
      </div>
    </div>,

    // Slide 3: Success Rate
    <div key="success" className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 animate-fade-in">
        <p className="text-xl md:text-2xl text-gray-400 mb-8">Your success rate</p>
        <h1 className="text-8xl md:text-9xl font-black mb-6 text-primary-500">
          {successRate}%
        </h1>
        <p className="text-xl text-gray-300">
          {formatNumber(stats.successfulTransactions)} successful transactions
        </p>
      </div>
    </div>,

    // Slide 4: Most Active
    <div key="active" className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 animate-fade-in">
        <p className="text-xl md:text-2xl text-gray-400 mb-8">Your most active day</p>
        <h1 className="text-5xl md:text-6xl font-black mb-6 text-primary-500">
          {stats.mostActiveDay}
        </h1>
        <p className="text-lg text-gray-400 mt-8">Most active month: {stats.mostActiveMonth}</p>
      </div>
    </div>,

    // Slide 5: Value
    <div key="value" className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 animate-fade-in">
        <p className="text-xl md:text-2xl text-gray-400 mb-8">You moved</p>
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-primary-500">
          {formatEther(stats.totalValueSent)}
        </h1>
        <p className="text-2xl md:text-3xl font-bold mb-4 text-white">ETH sent</p>
        <p className="text-lg text-gray-400">and received {formatEther(stats.totalValueReceived)} ETH</p>
      </div>
    </div>,

    // Slide 6: Full Stats
    <div key="full" className="min-h-screen py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your 2025 Wrapped
            </h2>
            <p className="text-gray-400 font-mono text-sm">{shortenAddress(address, 12)}</p>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-primary-500/50 transition-all text-sm"
          >
            ← New Wallet
          </button>
        </div>

        {chains.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-sm text-gray-500">Chains:</span>
            {chains.map((chain) => (
              <span
                key={chain}
                className="px-3 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-sm text-gray-300"
              >
                {chain}
              </span>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Transactions"
            value={formatNumber(stats.totalTransactions)}
            subtitle={`${stats.totalDaysActive} active days`}
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            subtitle={`${formatNumber(stats.successfulTransactions)} successful`}
          />
          <StatCard
            title="Total Gas Spent"
            value={`${formatEther(stats.totalGasSpent)} ETH`}
            subtitle={`Avg: ${formatGwei(stats.averageGasPrice)} Gwei`}
          />
          <StatCard
            title="Value Sent"
            value={`${formatEther(stats.totalValueSent)} ETH`}
            subtitle="Total outgoing"
          />
          <StatCard
            title="Value Received"
            value={`${formatEther(stats.totalValueReceived)} ETH`}
            subtitle="Total incoming"
          />
          <StatCard
            title="Tokens Interacted"
            value={formatNumber(stats.uniqueTokensInteracted)}
            subtitle={`${formatNumber(stats.uniqueContractsInteracted)} contracts`}
          />
        </div>

        {/* Most Active Day/Month */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Activity Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Most Active Day</p>
              <p className="text-2xl font-bold text-white">{stats.mostActiveDay}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Most Active Month</p>
              <p className="text-2xl font-bold text-white">{stats.mostActiveMonth}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Transactions by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Success vs Failed</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tokens */}
        {stats.topTokens.length > 0 && (
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Top Tokens</h3>
            <div className="space-y-2">
              {stats.topTokens.slice(0, 5).map((token, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 flex items-center justify-between hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-sm text-gray-400">{formatNumber(token.count)} transfers</p>
                    </div>
                  </div>
                  <p className="font-semibold text-white">
                    {formatEther(token.value)} tokens
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Contracts */}
        {stats.topContracts.length > 0 && (
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Most Interacted Contracts</h3>
            <div className="space-y-2">
              {stats.topContracts.slice(0, 5).map((contract, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 flex items-center justify-between hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-white">{shortenAddress(contract.address, 6)}</p>
                      <p className="text-sm text-gray-400">{formatNumber(contract.count)} interactions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chain Breakdown */}
        {chains.length > 1 && (
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Activity by Chain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(chainBreakdown).map(([chain, data]) => (
                <div
                  key={chain}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4"
                >
                  <p className="font-semibold text-white mb-2">{chain}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      {formatNumber(data.transactions)} transactions
                    </p>
                    <p className="text-gray-400">
                      {formatNumber(data.tokens)} token transfers
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>Generated for {address}</p>
          <p className="mt-1">Wallet Wrapped 2025</p>
        </div>
      </div>
    </div>,
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Audio */}
      <AudioPlayer autoPlay={true} loop={true} volume={0.2} />

      {/* Slide Navigation */}
      {currentSlide < 5 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
          {slides.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all ${currentSlide === index ? 'bg-primary-500 w-8' : 'bg-gray-700 w-2'
                }`}
            />
          ))}
        </div>
      )}

      {/* Skip to full view button */}
      {currentSlide < 5 && (
        <button
          onClick={() => setCurrentSlide(5)}
          className="fixed top-8 right-8 z-50 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-primary-500/50 transition-all text-sm text-gray-300"
        >
          Skip to Full View
        </button>
      )}

      {/* Slides */}
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="card p-6 card-hover">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold mb-1 text-white">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  )
}
