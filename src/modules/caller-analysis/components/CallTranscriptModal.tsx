import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'
import { Modal } from '@/components/ui'
import type { CallData } from '../types'

export interface CallTranscriptModalProps {
    callerData: CallData
    isOpen: boolean
    onClose: () => void
}

export const CallTranscriptModal: React.FC<CallTranscriptModalProps> = ({
    callerData,
    isOpen,
    onClose
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    // Mock transcript data - in real app this would come from API
    const transcriptData = [
        {
            timestamp: '00:00',
            speaker: 'A',
            text: 'Please hold while we connect your call. Calls may be recorded. Thank you for calling acre plumbing and air. Your call may be recorded for quality assurance. Have you ever answered your door and not known the person on the other side for your peace of mind?'
        },
        {
            timestamp: '00:20',
            speaker: 'A',
            text: 'All of our technicians wear an identification badge. We subscribe to the technician seal of safety that assures you all staff members are drug free, well trained, and have had a criminal background check performed before employment with Acriair. Thank you for holding. Our representative will be with you momentarily. 1800 we are open a cre air.'
        },
        {
            timestamp: '00:46',
            speaker: 'B',
            text: 'Need a repair, but don\'t want surprises when you get the bill. We know what you mean. Our straightforward pricing means you know the price before we start. We don\'t charge more, even if the job takes longer. Our technicians are fully trained and come to your home in a fully stocked.'
        }
    ]

    if (!isOpen || !callerData) {
        return null
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Call Transcript"
            size="lg"
            className="max-w-4xl"
            border={true}
        >
            <div className="space-y-4">
                {/* Call Info Header */}
                <div className={clsx(
                    'p-4',
                    isDark ? 'bg-[#1B456F]/20 border-b border-[#1B456F]' : 'bg-[#F8F9FA] border border-[#E1E5E9]'
                )}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={clsx(
                                'text-lg font-semibold',
                                isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                            )}>
                                Caller ID: {callerData.callerId}
                            </h3>
                            <p className={clsx(
                                'text-sm',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}>
                                Duration: {callerData.duration} | Last Call: {callerData.lastCall}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transcript Content */}
                <div className={clsx(
                    'p-4',
                    isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                )}>
                    <div className="space-y-4">
                        {transcriptData.map((entry, index) => (
                            <div key={index} className="flex gap-4">
                                {/* Timestamp */}
                                <div className={clsx(
                                    'text-sm font-mono w-16 flex-shrink-0',
                                    isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                                )}>
                                    {entry.timestamp}
                                </div>
                                
                                {/* Speaker and Text */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-2">
                                        <span className={clsx(
                                            'px-2 py-1 rounded text-xs font-medium flex-shrink-0',
                                            entry.speaker === 'A' 
                                                ? (isDark ? 'bg-[#1B456F] text-[#F5F8FA]' : 'bg-[#E1E5E9] text-[#3F4254]')
                                                : (isDark ? 'bg-[#2D596B] text-[#F5F8FA]' : 'bg-[#D1D5D9] text-[#3F4254]')
                                        )}>
                                            {entry.speaker}
                                        </span>
                                        <p className={clsx(
                                            'text-sm leading-relaxed',
                                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                        )}>
                                            {entry.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call Summary */}
                <div className={clsx(
                    'p-4',
                    isDark ? 'bg-[#1B456F]/20 border-t border-[#1B456F]' : 'bg-[#F8F9FA] border border-[#E1E5E9]'
                )}>
                    <h4 className={clsx(
                        'text-md font-semibold mb-3',
                        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                    )}>
                        Call Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className={clsx(
                                'text-lg font-bold',
                                isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                            )}>
                                {callerData.duration}
                            </div>
                            <div className={clsx(
                                'text-xs',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}>
                                Duration
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={clsx(
                                'text-lg font-bold',
                                isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                            )}>
                                ${callerData.lifetimeRevenue.toFixed(2)}
                            </div>
                            <div className={clsx(
                                'text-xs',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}>
                                Revenue
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={clsx(
                                'text-lg font-bold',
                                isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                            )}>
                                {callerData.status.length}
                            </div>
                            <div className={clsx(
                                'text-xs',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}>
                                Status Count
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CallTranscriptModal
