import type { FilterState } from '../types'
import { cn } from '@/lib'
import { TimeFilter } from '@/components/ui'

interface DateFilterSectionProps {
    dateRange: FilterState['dateRange']
    onDateRangeChange: (range: { from?: Date; to?: Date }) => void
}

export const DateFilterSection: React.FC<DateFilterSectionProps> = ({
    dateRange,
    onDateRangeChange,
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
                Date
            </p>
            <TimeFilter
                value={dateRange}
                onChange={onDateRangeChange}
                className="w-full"
                filterType="raw"
            />
        </div>
    )
}
