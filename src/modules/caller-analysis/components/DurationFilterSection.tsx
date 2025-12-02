import type { FilterState } from '../types'
import { cn } from '@/lib'
import { DurationRangeFilter } from '@/components/ui'

interface DurationFilterSectionProps {
    durationRange: FilterState['durationRange']
    onDurationRangeChange: (range: { min?: number; max?: number }) => void
}

export const DurationFilterSection: React.FC<DurationFilterSectionProps> = ({
    durationRange,
    onDurationRangeChange,
}) => {
    return (
        <div className="flex-1 flex flex-col gap-[24px] overflow-y-auto custom-scroll min-h-0">
            <p
                className={cn(
                    'font-["Poppins:SemiBold",sans-serif]',
                    'leading-[normal] not-italic text-[14px]',
                    'text-[#a1a5b7] text-nowrap uppercase shrink-0'
                )}
            >
                Duration
            </p>
            <DurationRangeFilter
                value={durationRange}
                onChange={onDurationRangeChange}
                className="w-full"
                filterType="raw"
            />
        </div>
    )
}
