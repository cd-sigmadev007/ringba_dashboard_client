import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { cn } from '@/lib'
import { useThemeStore } from '@/store/themeStore'
import { PauseIcon, PlayIcon } from '@/assets/svg'
import Button from './Button'

interface WaveformAudioPlayerProps {
    audioUrl: string
    isVisible: boolean
    onPlayPause?: (playing: boolean) => void
    isPlaying?: boolean
    className?: string
    showBorder?: boolean // Control border visibility
    onClose?: () => void // Optional close handler for fixed position players
}

// Get proxy URL for audio to avoid CORS issues
const getProxyUrl = (audioUrl: string): string => {
    if (!audioUrl) return audioUrl
    
    // If URL is already from our backend, use it directly
    if (audioUrl.startsWith('/api/') || audioUrl.startsWith('http://localhost:3001') || audioUrl.includes('insidefi.co')) {
        return audioUrl
    }
    
    // Otherwise, proxy through our backend
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
    const apiBaseUrl = baseUrl.endsWith('/api')
        ? baseUrl
        : baseUrl.replace(/\/$/, '') + '/api'
    
    return `${apiBaseUrl}/audio-proxy?url=${encodeURIComponent(audioUrl)}`
}

export const WaveformAudioPlayer: React.FC<WaveformAudioPlayerProps> = ({
    audioUrl,
    isVisible,
    onPlayPause,
    isPlaying: externalIsPlaying = false,
    className,
    showBorder = true,
    onClose,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const waveformRef = useRef<HTMLDivElement>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null)
    const isMountedRef = useRef(true)
    const onPlayPauseRef = useRef<((playing: boolean) => void) | undefined>(
        onPlayPause
    )
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    // Keep latest onPlayPause callback in a ref so WaveSurfer event handlers
    // don't force re-initialization on every render
    useEffect(() => {
        onPlayPauseRef.current = onPlayPause
    }, [onPlayPause])

    // Track mounted state to avoid setting state after unmount
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    // Use external isPlaying state if provided
    const isPlaying = externalIsPlaying

    // Format time to MM:SS
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    // Initialize WaveSurfer - only when audioUrl, isVisible, or isDark changes
    useEffect(() => {
        if (!waveformRef.current || !audioUrl || !isVisible) {
            // Cleanup if not visible
            if (wavesurferRef.current) {
                try {
                    wavesurferRef.current.destroy()
                } catch (err) {
                    // Ignore cleanup errors
                }
                wavesurferRef.current = null
            }
            return
        }

        // Destroy existing instance if it exists
        if (wavesurferRef.current) {
            try {
                wavesurferRef.current.destroy()
            } catch (err) {
                // Ignore cleanup errors
            }
        }

        setIsLoading(true)
        setError(null)
        setCurrentTime(0)
        setDuration(0)

        // Create WaveSurfer instance with wave-like structure
        // Colors match Figma design: #5E6278 for dark mode waveform bars
        const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: isDark ? '#5E6278' : '#E1E5E9', // #5E6278 for dark mode, light gray for light mode
            progressColor: '#007FFF', // Primary blue for played portion
            cursorColor: 'transparent',
            barWidth: 2,
            barRadius: 1,
            barGap: 1,
            height: 21,
            normalize: true,
            backend: 'MediaElement', // Use MediaElement for better compatibility
            mediaControls: false,
            interact: true,
            dragToSeek: true,
            // Use bottom align, but visually center bars via fixed height container
        })

        wavesurferRef.current = wavesurfer

        // Load audio through proxy to avoid CORS issues
        const proxyUrl = getProxyUrl(audioUrl)
        
        // Handle the load promise to catch AbortErrors
        const loadPromise = wavesurfer.load(proxyUrl)
        if (loadPromise && typeof loadPromise.catch === 'function') {
            loadPromise.catch((err: any) => {
                // Silently ignore AbortError - it's expected when component unmounts or audio changes
                if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
                    return
                }
                // Only log non-abort errors if component is still mounted
                if (isMountedRef.current) {
                    console.warn('WaveSurfer load error:', err)
                }
            })
        }

        // Event handlers
        const handleReady = () => {
            if (!isMountedRef.current) return
            setDuration(wavesurfer.getDuration())
            setIsLoading(false)
            setError(null)
        }

        const handlePlay = () => {
            onPlayPauseRef.current?.(true)
        }

        const handlePause = () => {
            onPlayPauseRef.current?.(false)
        }

        const handleTimeUpdate = () => {
            if (!isMountedRef.current) return
            setCurrentTime(wavesurfer.getCurrentTime())
        }

        const handleError = (err: Error | any) => {
            // Silently ignore AbortError - it's expected during cleanup/unmount
            if (err?.name === 'AbortError' || err?.message?.includes('aborted') || err?.message?.includes('BodyStreamBuffer was aborted')) {
                return
            }
            if (!isMountedRef.current) return
            console.error('WaveSurfer error:', err)
            setError('Failed to load audio')
            setIsLoading(false)
        }

        wavesurfer.on('ready', handleReady)
        wavesurfer.on('play', handlePlay)
        wavesurfer.on('pause', handlePause)
        wavesurfer.on('timeupdate', handleTimeUpdate)
        wavesurfer.on('error', handleError)

        // Cleanup
        return () => {
            try {
                if (!wavesurferRef.current) return

                // Remove all event listeners first
                try {
                    wavesurfer.un('ready', handleReady)
                    wavesurfer.un('play', handlePlay)
                    wavesurfer.un('pause', handlePause)
                    wavesurfer.un('timeupdate', handleTimeUpdate)
                    wavesurfer.un('error', handleError)
                } catch {
                    // Ignore errors when removing listeners
                }

                // Stop playback before destroying
                try {
                    if (wavesurfer.isPlaying()) {
                        wavesurfer.pause()
                    }
                } catch {
                    // Ignore pause errors
                }

                // Destroy the instance
                try {
                    wavesurfer.destroy()
                } catch {
                    // Silently ignore all cleanup errors including AbortError
                }
            } finally {
                wavesurferRef.current = null
            }
        }
    }, [audioUrl, isVisible, isDark])

    // Sync external play state
    useEffect(() => {
        const wavesurfer = wavesurferRef.current
        if (!wavesurfer || isLoading) return

        if (isPlaying && !wavesurfer.isPlaying()) {
            wavesurfer.play().catch((err: any) => {
                // Ignore AbortError during play
                if (err?.name !== 'AbortError' && !err?.message?.includes('aborted')) {
                    console.warn('WaveSurfer play error:', err)
                }
                onPlayPauseRef.current?.(false)
            })
        } else if (!isPlaying && wavesurfer.isPlaying()) {
            wavesurfer.pause()
        }
    }, [isPlaying, isLoading])

    // Handle play/pause
    const togglePlayPause = () => {
        const wavesurfer = wavesurferRef.current
        if (!wavesurfer || isLoading) return

        if (wavesurfer.isPlaying()) {
            wavesurfer.pause()
        } else {
            wavesurfer.play().catch((err: any) => {
                // Ignore AbortError during play
                if (err?.name !== 'AbortError' && !err?.message?.includes('aborted')) {
                    console.warn('WaveSurfer play error:', err)
                }
                onPlayPauseRef.current?.(false)
            })
        }
    }

    if (!isVisible || !audioUrl) return null

    if (error) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center px-5 py-4 rounded-lg',
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
                'flex items-center justify-between p-4 gap-x-2 shadow-lg',
                'rounded-[7px] shadow-[0_12px_24px_0_rgba(10,24,40,1)]',
                isDark
                    ? 'bg-[#0A1828]'
                    : 'bg-white',
                showBorder && (isDark ? 'border border-[#1B456F]' : 'border border-[#E1E5E9]'),
                className
            )}
        >
            {/* Play/Pause Button */}
            <div className="flex items-center justify-center shrink-0">
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
            </div>

            {/* Current Time */}
            <span
                className={cn(
                    'text-xs font-medium shrink-0 mx-2',
                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                )}
            >
                {formatTime(currentTime)}
            </span>

            {/* Waveform */}
            <div className="flex-1 flex justify-center mx-4">
                <div
                    ref={waveformRef}
                    className="h-[21px] w-[428px] max-w-full"
                    style={{ minHeight: '21px' }}
                />
            </div>

            {/* Total Duration */}
            <span
                className={cn(
                    'text-xs font-medium shrink-0',
                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                )}
            >
                {formatTime(duration)}
            </span>

            {/* Close Button (only for fixed position players) */}
            {onClose && (
                <button
                    onClick={onClose}
                    className={cn(
                        'ml-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0',
                        isDark ? 'text-[#A1A5B7] hover:text-[#F5F8FA]' : 'text-[#5E6278] hover:text-[#3F4254]'
                    )}
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className={cn(
                            'stroke-2',
                            isDark ? 'stroke-[#A1A5B7]' : 'stroke-[#5E6278]'
                        )}
                    >
                        <path d="M1 1L9 9M9 1L1 9" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default WaveformAudioPlayer
