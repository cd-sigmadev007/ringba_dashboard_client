import React, { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { get, isEqual } from 'lodash'
import { Modal } from './Modal'
import { cn, useClickOutside, useIsMobile } from '@/lib'
import { useThemeStore } from '@/store/themeStore'
import { CheckboxIcon, ChevronDownDark, ChevronDownLight } from '@/assets/svg'

export interface SelectOption {
    title: string
    value: string
    icon?: string
    soon?: boolean
}

interface FilterSelectProps {
    className?: string
    defaultValue?: SelectOption
    filterList?: Array<SelectOption>
    setFilter?: (value: string | Array<string>) => void
    multiple?: boolean
    selectedValues?: Array<string>
    error?: boolean
}

/**
 * FilterSelect – dropdown select control adopted from the `frontend` repo.
 * It respects the global theme and semantic Tailwind colour tokens defined in `tailwind.config.ts`.
 */
const FilterSelect: React.FC<FilterSelectProps> = ({
    className,
    defaultValue = { title: '', value: '' },
    filterList = [{ title: '', value: '' }],
    setFilter = () => undefined,
    multiple = false,
    selectedValues = [],
    error = false,
}) => {
    const [openSelect, setOpenSelect] = useState(false)
    const [selected, setSelected] = useState<SelectOption>(defaultValue)
    const [multiSelected, setMultiSelected] =
        useState<Array<string>>(selectedValues)
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>(
        'bottom'
    )
    const [searchText, setSearchText] = useState('')
    const [filteredList, setFilteredList] =
        useState<Array<SelectOption>>(filterList)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const theme = useThemeStore((s) => s.theme) // 'dark' | 'light'
    const isMobile = useIsMobile()
    const isInitialMount = useRef(true)
    const userInteractionRef = useRef(false)
    const selectRef = useClickOutside<HTMLDivElement>(() => {
        // Only close on click outside for desktop (when not using mobile modal)
        if (!isMobile) {
            setOpenSelect(false)
            setSearchText('')
        }
    })

    // Filter options based on search text
    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredList(filterList)
            return
        }

        const searchLower = (searchText ?? '').toLowerCase()
        const filtered = filterList.filter((option) =>
            (option.title ?? '').toLowerCase().includes(searchLower)
        )
        setFilteredList(filtered)

        // Auto-select first matching option for single select
        if (!multiple && filtered.length > 0) {
            const firstMatch = filtered[0]
            if (!isEqual(selected.value, firstMatch.value)) {
                setSelected(firstMatch)
            }
        }
    }, [searchText, filterList, multiple, selected.value])

    // Reset search when dropdown closes
    useEffect(() => {
        if (!openSelect) {
            setSearchText('')
        }
    }, [openSelect])

    // Check available space and position dropdown accordingly
    useEffect(() => {
        if (openSelect && !isMobile && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
            const dropdownHeight = Math.min(filteredList.length * 40 + 20, 320) // Approximate height

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPosition('top')
            } else {
                setDropdownPosition('bottom')
            }
        }
    }, [openSelect, isMobile, filteredList.length])

    // Sync selected state with defaultValue prop changes (without triggering callbacks)
    useEffect(() => {
        if (
            !multiple &&
            defaultValue &&
            defaultValue.value &&
            !isEqual(selected, defaultValue)
        ) {
            setSelected(defaultValue)
        }
    }, [defaultValue, multiple, selected])

    useEffect(() => {
        if (!multiple) {
            // Only call setFilter if it's from user interaction, not initial mount or prop change
            if (isInitialMount.current) {
                isInitialMount.current = false
                return
            }
            if (userInteractionRef.current) {
                setOpenSelect(false)
                setFilter(get(selected, 'value'))
                userInteractionRef.current = false
            }
        }
    }, [selected, multiple, setFilter])

    useEffect(() => {
        if (multiple) {
            setFilter(multiSelected)
        }
    }, [multiSelected])

    const handleOptionClick = (option: SelectOption) => {
        if (multiple) {
            const newSelected = multiSelected.includes(option.value)
                ? multiSelected.filter((v) => v !== option.value)
                : [...multiSelected, option.value]
            setMultiSelected(newSelected)
        } else {
            userInteractionRef.current = true // Mark as user interaction
            setSelected(option)
            setOpenSelect(false)
        }
    }

    const getDisplayText = () => {
        if (multiple) {
            if (multiSelected.length === 0) return defaultValue.title
            if (multiSelected.length === 1) {
                const option = filterList.find(
                    (opt) => opt.value === multiSelected[0]
                )
                return option?.title || defaultValue.title
            }
            return `${multiSelected.length} selected`
        }
        return selected.title
    }

    // isDark
    // ? 'bg-[#002B57] text-[#A1A5B7] border-transparent hover:!border-transparent focus:!border-transparent'
    // : 'bg-white text-[#3F4254] border-[#ECECEC] hover:!border-[#ECECEC] focus:!border-[#ECECEC]'
    /**
     * Helpers – colour classes based on current theme.
     */
    const isDark = theme === 'dark'

    // Main trigger styles
    const triggerBg = isDark ? 'bg-[#002B57]' : 'bg-white'
    const triggerText = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const triggerBorderOpen = isDark ? 'border-[#007FFF]' : 'border-[#007FFF]'
    const triggerBorderClosed = error
        ? 'border-[#F64E60]'
        : 'border-transparent'
    const triggerBorderError = error ? 'border-[#F64E60]' : ''
    const triggerHover = isDark
        ? 'hover:border-[#007FFF]'
        : 'hover:border-[#007FFF]'

    // Dropdown styles
    const dropdownBg = isDark ? 'bg-[#002B57]' : 'bg-white'
    const dropdownShadow = isDark
        ? 'shadow-[0_10px_35px_rgba(0,0,0,0.30)]'
        : 'shadow-[0_10px_35px_rgba(55,71,109,0.10)]'

    // Option styles
    const optionText = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const optionHover = isDark ? 'hover:bg-[#1B456C]' : 'hover:bg-[#F5F8FA]'
    const optionSelected = isDark ? 'bg-[#1B456C]' : 'bg-[#E3F2FD]'

    const disabledText = isDark ? 'text-[#5E6278]' : 'text-[#A1A5B7]'

    // Handle keyboard input for type-to-navigate
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!openSelect) return

            // Ignore special keys
            if (
                e.key === 'Enter' ||
                e.key === 'Escape' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === 'Tab' ||
                e.ctrlKey ||
                e.metaKey ||
                e.altKey
            ) {
                return
            }

            // Clear timeout if exists
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }

            // Update search text
            if (e.key.length === 1) {
                setSearchText((prev) => prev + e.key)
            } else if (e.key === 'Backspace') {
                setSearchText((prev) => prev.slice(0, -1))
            }

            // Clear search after 1 second of no typing
            searchTimeoutRef.current = setTimeout(() => {
                setSearchText('')
            }, 1000)
        },
        [openSelect]
    )

    // Add keyboard event listener when dropdown is open
    useEffect(() => {
        if (openSelect && !isMobile) {
            window.addEventListener('keydown', handleKeyDown)
            return () => {
                window.removeEventListener('keydown', handleKeyDown)
                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current)
                }
            }
        }
    }, [openSelect, isMobile, handleKeyDown])

    // Content that will be used in both desktop dropdown and mobile modal
    const optionsContent = (
        <ul
            className={cn(
                'flex flex-col gap-y-1 max-h-50 text-xs p-2.5',
                isMobile && 'p-0',
                !isMobile && 'overflow-y-auto custom-scroll'
            )}
        >
            {filteredList.map((item: SelectOption) => (
                <li
                    key={item.value}
                    className={clsx(
                        'flex items-center gap-x-2.5 p-2 rounded-[7px] cursor-pointer transition-colors',
                        optionText,
                        (multiple
                            ? multiSelected.includes(item.value)
                            : isEqual(item.value, selected.value)) &&
                            optionSelected,
                        item.soon && disabledText,
                        !item.soon && optionHover
                    )}
                    onClick={() => {
                        if (!item.soon) handleOptionClick(item)
                    }}
                >
                    {/* Checkbox indicator for all items */}
                    {multiple && (
                        <div className="flex items-center justify-center w-5 h-5">
                            <CheckboxIcon
                                checked={multiSelected.includes(item.value)}
                                isDark={isDark}
                            />
                        </div>
                    )}
                    {item.icon && (
                        <img
                            src={item.icon}
                            alt={item.title}
                            className="w-5 h-5"
                        />
                    )}
                    <span className="flex-1">{item.title}</span>
                    {item.soon && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-500 text-black ml-auto">
                            Soon
                        </span>
                    )}
                </li>
            ))}
        </ul>
    )

    return (
        <div ref={selectRef} className="relative w-full font-medium">
            {/* Trigger */}
            <div
                className={twMerge(
                    clsx(
                        'h-10 cursor-pointer w-full flex gap-x-2.5 justify-between items-center py-[9px] text-xs px-[16px] rounded-[7px] border transition-all duration-200',
                        triggerBg,
                        triggerText,
                        openSelect
                            ? error
                                ? triggerBorderError
                                : triggerBorderOpen
                            : triggerBorderClosed,
                        !error && triggerHover,
                        className
                    )
                )}
                onClick={() => setOpenSelect((prev) => !prev)}
            >
                <span className="flex items-center gap-x-2.5">
                    {!multiple && get(selected, 'icon') && (
                        <img
                            src={get(selected, 'icon') as string}
                            alt={get(selected, 'title')}
                            className="w-5 h-5"
                        />
                    )}
                    <span>{getDisplayText()}</span>
                </span>
                {/* Chevron */}
                {isDark ? (
                    <ChevronDownDark
                        className={clsx(
                            'transition-transform duration-200',
                            openSelect && 'rotate-180'
                        )}
                    />
                ) : (
                    <ChevronDownLight
                        className={clsx(
                            'transition-transform duration-200',
                            openSelect && 'rotate-180'
                        )}
                    />
                )}
            </div>

            {/* Desktop dropdown */}
            {!isMobile && openSelect && (
                <div
                    className={clsx(
                        'w-full absolute rounded-[7px] z-40 backdrop-blur-[25px]',
                        dropdownPosition === 'bottom'
                            ? 'mt-2'
                            : 'mb-2 bottom-full',
                        dropdownBg,
                        dropdownShadow
                    )}
                >
                    {optionsContent}
                </div>
            )}

            {/* Mobile modal */}
            {isMobile && (
                <Modal
                    open={openSelect}
                    onClose={() => setOpenSelect(false)}
                    title={multiple ? 'Select Options' : 'Select Option'}
                    size="sm"
                    className="w-full"
                    position="bottom"
                    animation="slide"
                    border={false}
                    showCloseButton={true}
                >
                    <div className="flex-1">{optionsContent}</div>
                </Modal>
            )}
        </div>
    )
}

export default FilterSelect
