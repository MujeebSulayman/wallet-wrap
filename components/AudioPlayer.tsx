'use client'

import { useState, useEffect, useRef } from 'react'

interface AudioPlayerProps {
  src?: string
  autoPlay?: boolean
  loop?: boolean
  volume?: number
}

export default function AudioPlayer({ 
  src = '/audio/loopazon-1766746550-blue-midnight-keys.wav', 
  autoPlay = true, 
  loop = true,
  volume = 0.2 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume

    const handleError = (e: any) => {
      console.log('Audio error:', e)
      setIsPlaying(false)
    }

    const handleCanPlay = () => {
      console.log('Audio can play')
      if (autoPlay && hasUserInteracted) {
        audio.play().catch(() => {
          setIsPlaying(false)
        })
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    audio.load()

    return () => {
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay, volume, isMuted, hasUserInteracted])

  useEffect(() => {
    const enableAudio = () => {
      setHasUserInteracted(true)
      const audio = audioRef.current
      if (audio && autoPlay) {
        audio.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          setIsPlaying(false)
        })
      }
    }

    document.addEventListener('click', enableAudio, { once: true })
    document.addEventListener('keydown', enableAudio, { once: true })
    document.addEventListener('touchstart', enableAudio, { once: true })

    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
      document.removeEventListener('touchstart', enableAudio)
    }
  }, [autoPlay])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    setHasUserInteracted(true)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch((error) => {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
      })
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="auto"
      />
      <div className="fixed bottom-8 right-8 z-50 flex gap-2">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary-500/50 transition-all flex items-center justify-center text-gray-300 relative group"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {!hasUserInteracted && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></span>
          )}
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary-500/50 transition-all flex items-center justify-center text-gray-300"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}

