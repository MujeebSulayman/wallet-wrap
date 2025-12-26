'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiProps {
  trigger: boolean
  duration?: number
}

export default function Confetti({ trigger, duration = 3000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger || !canvasRef.current) return

    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    })

    const end = Date.now() + duration

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        return
      }

      myConfetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#9333ea', '#7e22ce'],
      })

      myConfetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#9333ea', '#7e22ce'],
      })
    }, 200)

    // Burst on trigger
    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8'],
    })

    return () => {
      clearInterval(interval)
    }
  }, [trigger, duration])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

