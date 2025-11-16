import React, { useMemo } from 'react'
import clsx from 'clsx'
import FilterSelect from './FilterSelect'
import type { SelectOption } from './FilterSelect'

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
)

export interface FormSelectProps {
    className?: string
    options: Array<SelectOption>
    value?: string
    placeholder?: string
    onChange?: (value: string) => void
    /** Optional fixed width, e.g. 'w-[440px]' */
    widthClassName?: string
    /** Optional error message to show below */
    error?: string
    /** Show loading spinner */
    loading?: boolean
}

/**
 * FormSelect
 * Thin wrapper around FilterSelect for single-select forms.
 * Uses the same trigger/dropdown visuals as FilterSelect to ensure consistent design.
 */
const FormSelect: React.FC<FormSelectProps> = ({
    className,
    options,
    value,
    placeholder = 'Select',
    onChange,
    widthClassName = 'w-full',
    error,
    loading = false,
}) => {
    const defaultOption = useMemo<SelectOption>(
        () =>
            value
                ? (options.find((o) => o.value === value) ?? {
                      title: placeholder,
                      value: '',
                  })
                : { title: placeholder, value: '' },
        [options, value, placeholder]
    )

    return (
        <div className={clsx('flex flex-col', widthClassName)}>
            <div className={clsx('flex-1 relative')}>
                <FilterSelect
                    key={defaultOption.value || 'empty'}
                    className={clsx(
                        'text-sm',
                        loading && 'opacity-60 pointer-events-none',
                        className
                    )}
                    defaultValue={defaultOption}
                    filterList={options}
                    setFilter={(v) => {
                        if (typeof v === 'string') {
                            onChange?.(v)
                        }
                    }}
                    multiple={false}
                    error={!!error}
                />
                {loading && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <Spinner />
                    </div>
                )}
            </div>
            {/* Error message - match Input component format */}
            {error && (
                <div className="mt-2 flex items-start gap-2">
                    <svg
                        className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
        </div>
    )
}

export default FormSelect
