import React from 'react'
import { cn } from '@/lib/utils'

export interface OnboardingDotsProps {
    total: number
    current: number
    className?: string
}

/** Pagination dots for onboarding. Figma: filled = current, outline = others. */
export const OnboardingDots: React.FC<OnboardingDotsProps> = ({
    total,
    current,
    className,
}) => (
    <div
        className={cn('flex gap-1.5 items-center', className)}
        role="tablist"
        aria-label="Onboarding step"
    >
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                role="tab"
                aria-selected={i === current}
                className={cn(
                    'rounded-full transition-colors',
                    i === current
                        ? 'w-2.5 h-2.5 bg-[#007FFF]'
                        : 'w-2 h-2 border border-[#A1A5B7] bg-transparent'
                )}
            />
        ))}
    </div>
)
