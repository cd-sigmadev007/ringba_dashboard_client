import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'

interface InvoiceLogoUploadProps {
    preview?: string
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemove?: () => void
}

export const InvoiceLogoUpload: React.FC<InvoiceLogoUploadProps> = ({
    preview,
    onFileChange,
    onRemove,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className="flex items-center gap-4">
            <label
                className={clsx(
                    'cursor-pointer flex items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                    isDark
                        ? 'bg-[#001E3C] border-[#1B456F] hover:border-[#007FFF] text-white'
                        : 'bg-white border-gray-300 hover:border-blue-500 text-gray-400',
                    'w-24 h-24'
                )}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Invoice logo"
                        className="w-full h-full object-contain rounded-lg p-2"
                    />
                ) : (
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                />
            </label>
            {preview && onRemove && (
                <button
                    onClick={onRemove}
                    className={clsx(
                        'text-sm px-3 py-1 rounded',
                        isDark
                            ? 'text-red-400 hover:bg-[#1B456F]'
                            : 'text-red-600 hover:bg-red-50'
                    )}
                >
                    Remove
                </button>
            )}
        </div>
    )
}
