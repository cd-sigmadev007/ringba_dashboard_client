import { useEffect, useState } from 'react'
import { CheckboxIcon, ChevronDownDark, SearchIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { cn, useClickOutside } from '@/lib'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export interface ColumnOption {
    id: string
    label: string
    category: 'applied' | 'caller' | 'adjustment' | 'dispute'
    visible: boolean
}

interface ColumnGroup {
    id: string
    label: string
    columns: Array<ColumnOption>
    expanded: boolean
}

interface ColumnsDropdownProps {
    columns: Array<ColumnOption>
    onColumnToggle: (columnId: string) => void
    onClose: () => void
    isOpen: boolean
    triggerRef?: React.RefObject<HTMLButtonElement | null>
}

export const ColumnsDropdown: React.FC<ColumnsDropdownProps> = ({
    columns,
    onColumnToggle,
    onClose,
    isOpen,
    triggerRef,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        new Set(['applied'])
    )
    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) {
            onClose()
        }
    })

    // Group columns by category
    const groupedColumns: Array<ColumnGroup> = [
        {
            id: 'applied',
            label: 'Applied',
            columns: columns.filter((c) => c.category === 'applied'),
            expanded: expandedGroups.has('applied'),
        },
        {
            id: 'caller',
            label: 'Caller',
            columns: columns.filter((c) => c.category === 'caller'),
            expanded: expandedGroups.has('caller'),
        },
        {
            id: 'adjustment',
            label: 'Adjustment',
            columns: columns.filter((c) => c.category === 'adjustment'),
            expanded: expandedGroups.has('adjustment'),
        },
        {
            id: 'dispute',
            label: 'Dispute',
            columns: columns.filter((c) => c.category === 'dispute'),
            expanded: expandedGroups.has('dispute'),
        },
    ]

    // Filter columns based on search
    const filteredGroups = groupedColumns.map((group) => ({
        ...group,
        columns: group.columns.filter((col) =>
            col.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    }))

    const toggleGroup = (groupId: string) => {
        const newExpanded = new Set(expandedGroups)
        if (newExpanded.has(groupId)) {
            newExpanded.delete(groupId)
        } else {
            newExpanded.add(groupId)
        }
        setExpandedGroups(newExpanded)
    }

    // Calculate dropdown position
    const [position, setPosition] = useState<{
        top?: number
        bottom?: number
        left?: number
        right?: number
    }>({})

    useEffect(() => {
        if (isOpen && triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
            const dropdownWidth = 374

            // Calculate right position to align dropdown's right edge with button's right edge
            const rightPosition = window.innerWidth - rect.right

            // Ensure dropdown doesn't go off screen on the left
            const maxRight = window.innerWidth - dropdownWidth
            const finalRight = Math.min(rightPosition, maxRight)

            if (spaceBelow < 400 && spaceAbove > spaceBelow) {
                setPosition({
                    bottom: window.innerHeight - rect.top,
                    right: finalRight,
                })
            } else {
                setPosition({
                    top: rect.bottom + 8,
                    right: finalRight,
                })
            }
        } else {
            setPosition({})
        }
    }, [isOpen, triggerRef])

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className={cn(
                'fixed z-[1000] absolute right-5 bg-[#002b57] border border-[#132f4c]',
                'rounded-[7px] shadow-lg',
                'w-[374px] max-h-[440px] flex flex-col'
            )}
            style={position}
        >
            {/* Search Input */}
            <div className="m-[14px] mb-0">
                <Input
                    type="text"
                    placeholder="Search Columns"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={
                        <SearchIcon
                            className={cn(
                                'size-[20px]',
                                isDark ? 'text-[#a1a5b7]' : 'text-[#5E6278]'
                            )}
                        />
                    }
                    className={cn(
                        'h-[41px]',
                        isDark ? 'bg-[#001e3c]' : 'bg-white'
                    )}
                    shadow={false}
                />
            </div>

            {/* Column Groups */}
            <div className="flex-1 overflow-y-auto custom-scroll p-[14px] pt-0">
                {filteredGroups.map((group) => {
                    if (group.columns.length === 0) return null

                    return (
                        <div
                            key={group.id}
                            className="flex flex-col items-start relative shrink-0 w-full"
                        >
                            {/* Group Header */}
                            <Button
                                variant="ghost"
                                onClick={() => toggleGroup(group.id)}
                                className={cn(
                                    'box-border flex gap-[8px] items-center',
                                    'px-0 py-[10px] rounded-[7px] shrink-0 w-full',
                                    'justify-start h-auto min-h-0 border-none'
                                )}
                            >
                                <div
                                    className={cn(
                                        'relative shrink-0 size-[13px] transition-transform',
                                        !expandedGroups.has(group.id) &&
                                            'rotate-180'
                                    )}
                                >
                                    <ChevronDownDark
                                        className={cn(
                                            'size-[13px]',
                                            isDark
                                                ? 'text-[#F5F8FA]'
                                                : 'text-[#3F4254]'
                                        )}
                                    />
                                </div>
                                {group.id === 'applied' && (
                                    <div className="relative shrink-0 size-[20px]">
                                        <CheckboxIcon
                                            checked={group.columns.every(
                                                (c) => c.visible
                                            )}
                                            isDark={isDark}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                )}
                                <p
                                    className={cn(
                                        'font-["Poppins:Regular",sans-serif]',
                                        'leading-[normal] not-italic relative shrink-0',
                                        'text-[#f5f8fa] text-[14px] text-center text-nowrap',
                                        isDark
                                            ? 'text-[#F5F8FA]'
                                            : 'text-[#3F4254]'
                                    )}
                                >
                                    {group.label}
                                </p>
                            </Button>

                            {/* Group Items */}
                            {expandedGroups.has(group.id) && (
                                <div className="box-border flex flex-col items-start px-[16px] py-0 relative shrink-0 w-full">
                                    {group.columns.map((column) => (
                                        <Button
                                            key={column.id}
                                            variant="ghost"
                                            onClick={() =>
                                                onColumnToggle(column.id)
                                            }
                                            className={cn(
                                                'box-border flex items-center',
                                                'px-[24px] py-[8px] rounded-[7px]',
                                                'shrink-0 w-full justify-start',
                                                'h-auto min-h-0 border-none'
                                            )}
                                        >
                                            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                                                <div className="relative shrink-0 size-[20px]">
                                                    <CheckboxIcon
                                                        checked={column.visible}
                                                        isDark={isDark}
                                                        className="w-5 h-5"
                                                    />
                                                </div>
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic',
                                                        'relative shrink-0 text-[#f5f8fa] text-[14px]',
                                                        'text-center text-nowrap',
                                                        isDark
                                                            ? 'text-[#F5F8FA]'
                                                            : 'text-[#3F4254]'
                                                    )}
                                                >
                                                    {column.label}
                                                </p>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
