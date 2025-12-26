'use client'

import { useState, useRef } from 'react'
import { SUPPORTED_CHAINS } from '@/lib/chains'

interface ChainSelectorProps {
  selectedChains: string[]
  onChainsChange: (chains: string[]) => void
}

export default function ChainSelector({ selectedChains, onChainsChange }: ChainSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const popularChains = SUPPORTED_CHAINS.filter((c) => 
    ['eth', 'base', 'polygon', 'arbitrum', 'optimism'].includes(c.id)
  )

  const toggleChain = (chainId: string) => {
    if (selectedChains.includes(chainId)) {
      onChainsChange(selectedChains.filter((id) => id !== chainId))
    } else {
      onChainsChange([...selectedChains, chainId])
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Select Networks
      </label>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 px-1"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {popularChains.map((chain) => {
          const isSelected = selectedChains.includes(chain.id)
          return (
            <button
              key={chain.id}
              type="button"
              onClick={() => toggleChain(chain.id)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-200 transform
                ${isSelected
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30 scale-105 border border-primary-500'
                  : 'bg-[#0a0a0a] border border-[#1f1f1f] text-gray-400 hover:border-primary-500/50 hover:bg-[#0f0f0f] hover:text-gray-300'
                }
              `}
            >
              {chain.name}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {selectedChains.length} network{selectedChains.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  )
}
