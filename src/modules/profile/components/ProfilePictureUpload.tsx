import React, { useState, useRef } from 'react'
import { DefaultAvatar } from '@/assets/svg'
import Button from '@/components/ui/Button'
import { DeleteIcon } from '@/assets/svg'

interface ProfilePictureUploadProps {
    currentPictureUrl?: string | null
    onPictureChange: (file: File | null) => void
    className?: string
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
    currentPictureUrl,
    onPictureChange,
    className = '',
}) => {
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
    }

    const toAbsoluteUrl = (url?: string | null) => {
        if (!url) return null
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        const base = getApiBaseUrl()
        const path = url.startsWith('/') ? url : `/${url}`
        return `${base}${path}`
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please select an image file (PNG, JPEG, WebP, GIF, or SVG).')
                return
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB.')
                return
            }

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            onPictureChange(file)
        }
    }

    const handleRemove = () => {
        setPreview(null)
        onPictureChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const displayUrl = preview || toAbsoluteUrl(currentPictureUrl)

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    {displayUrl ? (
                        <img
                            src={displayUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <DefaultAvatar className="w-full h-full" />
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="profile-picture-upload"
                />
                <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                >
                    {displayUrl ? 'Change' : 'Upload'}
                </Button>
                {displayUrl && (
                    <Button
                        variant="ghost"
                        onClick={handleRemove}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                        <DeleteIcon className="w-4 h-4" />
                        Remove
                    </Button>
                )}
            </div>
        </div>
    )
}
