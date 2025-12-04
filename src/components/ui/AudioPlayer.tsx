import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { cn } from '@/lib'
import { useThemeStore } from '@/store/themeStore'
import { PauseIcon, PlayIcon } from '@/assets/svg'

interface AudioPlayerProps {
    audioUrl: string
    isVisible: boolean
    onClose?: () => void
    onPlayPause?: (playing: boolean) => void
    isPlaying?: boolean
    className?: string
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    audioUrl,
    isVisible,
    onClose,
    onPlayPause,
    isPlaying: externalIsPlaying = false,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const audioRef = useRef<HTMLAudioElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)

    // Use external isPlaying state if provided
    const isPlaying = externalIsPlaying

    // Format time to MM:SS
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    // Handle play/pause
    const togglePlayPause = () => {
        if (onPlayPause) {
            onPlayPause(!isPlaying)
        }
    }

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const rect = progressRef.current.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const progressWidth = rect.width
            const clickPercent = clickX / progressWidth
            const newTime = clickPercent * duration
            audioRef.current.currentTime = newTime
        }
    }

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !audioUrl) return

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
            setIsLoading(false)
        }

        const handleTimeUpdate = () => {
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                setCurrentTime(audio.currentTime)
            })
        }

        const handlePlay = () => {
            if (onPlayPause) onPlayPause(true)
        }
        const handlePause = () => {
            if (onPlayPause) onPlayPause(false)
        }
        const handleEnded = () => {
            if (onPlayPause) onPlayPause(false)
        }
        const handleError = () => {
            setError('Failed to load audio')
            setIsLoading(false)
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('error', handleError)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('error', handleError)
        }
    }, [audioUrl, onPlayPause])

    // Auto-play/pause when external isPlaying state changes
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !audioUrl) return

        if (isPlaying) {
            audio.play().catch(() => {
                // Auto-play might be blocked by browser
                if (onPlayPause) onPlayPause(false)
            })
        } else {
            audio.pause()
        }
    }, [isPlaying, audioUrl, onPlayPause])

    if (!isVisible || !audioUrl) return null

    if (error) {
        return (
            <div
                className={cn(
                    'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50',
                    'flex items-center justify-center px-[20px] py-[16px] rounded-lg',
                    isDark
                        ? 'bg-red-900/20 text-red-400'
                        : 'bg-red-50 text-red-600',
                    className
                )}
            >
                <span className="text-sm">{error}</span>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'audio-player fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50',
                'flex items-center gap-2.5 p-4 shadow-lg',
                'w-[533px] h-[55px]',
                'rounded-[50px] shadow-[0_24px_30px_0_rgba(0,0,0,0.10)]',
                isDark
                    ? 'bg-[#132F4C] border border-[#007FFF]'
                    : 'bg-[#F5F8FA] border border-[#1B456F]',
                className
            )}
        >
            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Play/Pause Button */}
            <div className="flex items-center gap-2.5">
                <Button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    variant="ghost"
                    className={cn(
                        'p-0 h-6 w-6 flex items-center justify-center rounded-lg',
                        isDark
                            ? 'border-[#0254a5] hover:border-transparent'
                            : 'border-[#e0e0e0] hover:border-transparent',
                        isLoading && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    {isLoading ? (
                        <div className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <PauseIcon />
                    ) : (
                        <PlayIcon />
                    )}
                </Button>

                {/* Current Time */}
                <span
                    className={cn(
                        'text-sm font-medium',
                        isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                    )}
                >
                    {formatTime(currentTime)}
                </span>
            </div>

            {/* Progress Bar */}
            <div
                ref={progressRef}
                onClick={handleProgressClick}
                className={cn(
                    'flex-1 h-1.5 rounded-lg cursor-pointer relative overflow-hidden',
                    'bg-[#363636]'
                )}
            >
                <div
                    className={cn(
                        'h-full rounded-lg transition-all duration-75 ease-out',
                        'bg-[#007FFF]'
                    )}
                    style={{
                        width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                        transition: 'width 0.1s ease-out',
                    }}
                />
            </div>

            {/* Total Duration */}
            <span
                className={cn(
                    'text-sm font-medium',
                    isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                )}
            >
                {formatTime(duration)}
            </span>

            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center transition-colors'
                    )}
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className={cn(
                            'stroke-2',
                            isDark ? 'stroke-[#F5F8FA]' : 'stroke-gray-900'
                        )}
                    >
                        <path d="M1 1L9 9M9 1L1 9" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default AudioPlayer
