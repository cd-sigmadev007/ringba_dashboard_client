import React, { useEffect, useState } from 'react'
import type { ColumnVisibility } from '../hooks/useTableColumns'
import { CheckboxIcon, ChevronDownDark } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { cn, useClickOutside } from '@/lib'
import { Search } from '@/components/common'
import Button from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export interface ColumnOption {
    id: string
    label: string
    category: 'applied' | 'caller' | 'dispute' | 'dynamic'
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
    isMobile: boolean
    /** Called when user clicks Apply: pass draft visibility, then parent should set store and refetch */
    onApply?: (visibility: ColumnVisibility) => void
}

export const ColumnsDropdown: React.FC<ColumnsDropdownProps> = ({
    columns,
    onColumnToggle,
    onClose,
    isOpen,
    triggerRef,
    isMobile,
    onApply,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        new Set(['applied'])
    )
    // Draft visibility: apply only on Apply button (fixed columns)
    const [draftVisibility, setDraftVisibility] = useState<ColumnVisibility>({})
    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) {
            onClose()
        }
    })

    // Sync draft from current columns when dropdown opens
    useEffect(() => {
        if (isOpen && columns.length > 0) {
            setDraftVisibility(
                columns.reduce(
                    (acc, c) => ({ ...acc, [c.id]: c.visible }),
                    {} as ColumnVisibility
                )
            )
        }
    }, [isOpen, columns])

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
        if (!isMobile && isOpen && triggerRef?.current) {
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
    }, [isOpen, triggerRef, isMobile])

    if (!isOpen) return null

    // Shared content for both desktop and mobile
    const columnContent = (
        <>
            {/* Search Input */}
            <div
                className={cn(
                    isMobile
                        ? 'w-full sticky top-0 z-10 bg-[#071b2f]'
                        : 'm-[14px] mb-0'
                )}
            >
                <Search
                    placeholder="Search Columns"
                    onSearch={(query) => setSearchQuery(query)}
                    disableDropdown={true}
                    // Desktop search uses #001E3C, mobile uses Primary/#002B57 per Figma
                    background={isMobile ? 'bg-[#002b57]' : 'bg-[#001e3c]'}
                />
            </div>

            {/* Column Groups */}
            <div
                className={cn(
                    'flex-1 overflow-y-auto custom-scroll pt-2',
                    isMobile ? 'p-0' : 'p-[14px] pt-0'
                )}
            >
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
                                    'justify-start h-auto min-h-0 border-none',
                                    // Disable hover background/opacity
                                    'hover:bg-transparent hover:opacity-100 focus:bg-transparent active:bg-transparent'
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
                                {/* Per Figma: section header checkbox for non-Applied groups; clickable to select/deselect all */}
                                {group.id !== 'applied' &&
                                    (() => {
                                        const getVisible = (c: ColumnOption) =>
                                            onApply
                                                ? (draftVisibility[c.id] ??
                                                  c.visible)
                                                : c.visible
                                        const allChecked =
                                            group.columns.every(getVisible)
                                        const someChecked =
                                            group.columns.some(getVisible)
                                        const indeterminate =
                                            someChecked && !allChecked
                                        return (
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const newVal = !allChecked
                                                    if (onApply) {
                                                        setDraftVisibility(
                                                            (prev) => ({
                                                                ...prev,
                                                                ...Object.fromEntries(
                                                                    group.columns.map(
                                                                        (c) => [
                                                                            c.id,
                                                                            newVal,
                                                                        ]
                                                                    )
                                                                ),
                                                            })
                                                        )
                                                    } else {
                                                        group.columns.forEach(
                                                            (c) => {
                                                                if (
                                                                    getVisible(
                                                                        c
                                                                    ) !== newVal
                                                                ) {
                                                                    onColumnToggle(
                                                                        c.id
                                                                    )
                                                                }
                                                            }
                                                        )
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === ' '
                                                    ) {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        const newVal =
                                                            !allChecked
                                                        if (onApply) {
                                                            setDraftVisibility(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    ...Object.fromEntries(
                                                                        group.columns.map(
                                                                            (
                                                                                c
                                                                            ) => [
                                                                                c.id,
                                                                                newVal,
                                                                            ]
                                                                        )
                                                                    ),
                                                                })
                                                            )
                                                        } else {
                                                            group.columns.forEach(
                                                                (c) => {
                                                                    if (
                                                                        getVisible(
                                                                            c
                                                                        ) !==
                                                                        newVal
                                                                    ) {
                                                                        onColumnToggle(
                                                                            c.id
                                                                        )
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    }
                                                }}
                                                className="p-0 h-5 w-5 flex items-center justify-center border-none shrink-0 hover:bg-transparent hover:opacity-100 cursor-pointer"
                                            >
                                                <CheckboxIcon
                                                    checked={allChecked}
                                                    indeterminate={
                                                        indeterminate
                                                    }
                                                    isDark={isDark}
                                                    className="w-5 h-5"
                                                />
                                            </div>
                                        )
                                    })()}
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
                                    {group.columns.map((column) => {
                                        const checked = onApply
                                            ? (draftVisibility[column.id] ??
                                              column.visible)
                                            : column.visible
                                        return (
                                            <Button
                                                key={column.id}
                                                variant="ghost"
                                                onClick={() => {
                                                    if (onApply) {
                                                        setDraftVisibility(
                                                            (prev) => ({
                                                                ...prev,
                                                                [column.id]: !(
                                                                    prev[
                                                                        column
                                                                            .id
                                                                    ] ??
                                                                    column.visible
                                                                ),
                                                            })
                                                        )
                                                    } else {
                                                        onColumnToggle(
                                                            column.id
                                                        )
                                                    }
                                                }}
                                                className={cn(
                                                    'box-border flex items-center',
                                                    'px-[24px] py-[8px] rounded-[7px]',
                                                    'shrink-0 w-full justify-start',
                                                    'h-auto min-h-0 border-none',
                                                    // Disable hover & selected background
                                                    'hover:bg-transparent hover:opacity-100 focus:bg-transparent active:bg-transparent'
                                                )}
                                            >
                                                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                                                    <div className="relative shrink-0 size-[20px]">
                                                        <CheckboxIcon
                                                            checked={checked}
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
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Apply button footer */}
            {onApply && (
                <div
                    className={cn(
                        'shrink-0 border-t p-3',
                        isDark
                            ? 'border-[#1B456F] bg-[#001E3C]'
                            : 'border-[#E1E5E9] bg-[#F5F8FA]'
                    )}
                >
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                            onApply(draftVisibility)
                            onClose()
                        }}
                    >
                        Apply
                    </Button>
                </div>
            )}
        </>
    )

    // Mobile: Use Modal component as bottom sheet
    if (isMobile) {
        return (
            <Modal
                open={isOpen}
                onClose={onClose}
                title="Columns"
                position="bottom"
                size="full"
                animation="slide"
                overlay="default"
                className="h-[50vh] flex flex-col rounded-t-[10px]"
                showCloseButton
            >
                {columnContent}
            </Modal>
        )
    }

    // Desktop: Use dropdown
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
            {columnContent}
        </div>
    )
}
