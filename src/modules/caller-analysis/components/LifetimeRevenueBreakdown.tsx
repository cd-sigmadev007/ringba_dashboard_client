import React from 'react'
import { cn } from '@/lib'

export interface LifetimeRevenueBreakdownProps {
    totalCost: number
    adCost: number
    ringbaCost: number
    thirdPartyCost: number
    className?: string
}

export const LifetimeRevenueBreakdown: React.FC<
    LifetimeRevenueBreakdownProps
> = ({ totalCost, adCost, ringbaCost, thirdPartyCost, className = '' }) => {
    // Calculate percentages for progress bars
    const adPercentage = totalCost > 0 ? (adCost / totalCost) * 100 : 0
    const ringbaPercentage = totalCost > 0 ? (ringbaCost / totalCost) * 100 : 0
    const thirdPartyPercentage =
        totalCost > 0 ? (thirdPartyCost / totalCost) * 100 : 0

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {/* Total Cost Display */}
            <div className="text-sm font-semibold text-[#F5F8FA]">
                ${totalCost.toFixed(2)}
            </div>

            {/* Progress Bar Container */}
            <div className="w-24 h-2.5 rounded-lg overflow-hidden flex">
                {/* AD Cost Progress Bar - Blue from Figma */}
                <div
                    className="h-full"
                    style={{
                        width: `${adPercentage}%`,
                        backgroundColor: 'rgb(0, 127, 255)', // #007FFF from Figma
                    }}
                />

                {/* Ringba Cost Progress Bar - Orange from Figma */}
                <div
                    className="h-full"
                    style={{
                        width: `${ringbaPercentage}%`,
                        backgroundColor: 'rgb(255, 203, 102)', // #FFCB66 from Figma
                    }}
                />

                {/* Third Party Cost Progress Bar - Purple from Figma */}
                <div
                    className="h-full"
                    style={{
                        width: `${thirdPartyPercentage}%`,
                        backgroundColor: 'rgb(131, 72, 229)', // #8348E5 from Figma
                    }}
                />
            </div>
        </div>
    )
}

export default LifetimeRevenueBreakdown
