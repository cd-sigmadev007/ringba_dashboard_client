import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

const OrgLogoUploader: React.FC = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="flex items-center gap-4">
            <div
                className={clsx(
                    'w-16 h-16 rounded-full overflow-hidden flex items-center justify-center',
                    isDark ? 'bg-[#132F4C]' : 'bg-[#ECECEC]'
                )}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Org Logo"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span
                        className={clsx(
                            'text-xs',
                            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                        )}
                    >
                        Logo
                    </span>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    onClick={() => inputRef.current?.click()}
                >
                    Upload
                </Button>
                {preview && (
                    <Button variant="ghost" onClick={() => setPreview(null)}>
                        Remove
                    </Button>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onSelect}
                />
            </div>
        </div>
    )
}

export default OrgLogoUploader
