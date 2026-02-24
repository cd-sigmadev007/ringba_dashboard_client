import { useFilterTags } from '../hooks/useFilterTags'
import { CheckboxIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib'
import { Search } from '@/components/common'

interface StatusFilterSectionProps {
    selectedStatuses: Array<string>
    onStatusToggle: (statusValue: string) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    isOpen?: boolean
}

export const StatusFilterSection: React.FC<StatusFilterSectionProps> = ({
    selectedStatuses,
    onStatusToggle,
    searchQuery,
    onSearchChange,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { statusOptions, isLoadingTags } = useFilterTags()

    const filteredStatuses = statusOptions.filter((option) =>
        (option.title ?? '')
            .toLowerCase()
            .includes((searchQuery ?? '').toLowerCase())
    )

    return (
        <>
            <div className="flex flex-col gap-[5px] items-start shrink-0">
                <p
                    className={cn(
                        'font-["Poppins:SemiBold",sans-serif]',
                        'leading-[normal] not-italic text-[14px]',
                        'text-[#a1a5b7] text-nowrap uppercase'
                    )}
                >
                    Status
                </p>
                <Search
                    placeholder="Search Status"
                    className="w-full"
                    onSearch={onSearchChange}
                    disableDropdown={true}
                    background="bg-[#132f4c]"
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll flex flex-col gap-[5px] min-h-0">
                {isLoadingTags ? (
                    <div className="flex items-center justify-center py-4 shrink-0">
                        <span className="text-[14px] text-[#a1a5b7]">
                            Loading tags...
                        </span>
                    </div>
                ) : (
                    filteredStatuses.map((option) => {
                        const isSelected = selectedStatuses.includes(
                            option.value
                        )
                        return (
                            <button
                                key={option.value}
                                onClick={() => onStatusToggle(option.value)}
                                className={cn(
                                    'flex gap-[10px] items-center p-[5px]',
                                    'rounded-[7px] w-full text-left',
                                    'hover:opacity-80 transition-opacity',
                                    'box-border shrink-0'
                                )}
                            >
                                <CheckboxIcon
                                    checked={isSelected}
                                    isDark={isDark}
                                    className="size-[20px] shrink-0"
                                />
                                <p
                                    className={cn(
                                        'font-["Poppins:Regular",sans-serif]',
                                        'leading-[normal] not-italic text-[14px]',
                                        'text-[#f5f8fa] text-nowrap'
                                    )}
                                >
                                    {option.title}
                                </p>
                            </button>
                        )
                    })
                )}
            </div>
        </>
    )
}
