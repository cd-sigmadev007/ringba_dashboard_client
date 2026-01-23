import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import ProfileHeader from '../components/ProfileHeader'
import { ProfilePictureUpload } from '../components/ProfilePictureUpload'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import type { TabItem } from '@/components/ui/Tabs'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { Tabs } from '@/components/ui/Tabs'

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    return (
        <p
            className={clsx(
                'text-[14px] w-[220px] shrink-0',
                isDark ? 'text-white' : 'text-[#3F4254]'
            )}
        >
            {children}
        </p>
    )
}

const ProfilePage: React.FC = () => {
    const { user, updateProfile, refetchMe } = useAuth()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [profilePicture, setProfilePicture] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ firstName?: string }>({})

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '')
            setLastName(user.lastName || '')
        }
    }, [user])

    const handleSave = async () => {
        setErrors({})

        const fn = firstName.trim()
        if (!fn) {
            setErrors({ firstName: 'First name is required' })
            toast.error('First name is required')
            return
        }

        setLoading(true)
        try {
            await updateProfile({
                first_name: fn,
                last_name: lastName.trim() || undefined,
                profile_picture: profilePicture || undefined,
            })
            toast.success('Profile updated successfully')
            await refetchMe()
            setProfilePicture(null) // Clear file input after successful upload
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const textMuted = 'text-[#A1A5B7]'

    if (!user) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    const tabs: Array<TabItem> = [
        {
            id: 'general',
            label: 'General',
            content: (
                <div className="p-5 md:p-6">
                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                            <Label>Profile Picture</Label>
                            <div className="w-full">
                                <ProfilePictureUpload
                                    currentPictureUrl={user.profilePictureUrl}
                                    onPictureChange={setProfilePicture}
                                />
                                {profilePicture && (
                                    <p
                                        className={clsx(
                                            'text-xs mt-2',
                                            textMuted
                                        )}
                                    >
                                        New picture will be saved when you click
                                        "Save Changes"
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="horizontal-line my-4"></div>

                        {/* First Name */}
                        <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                            <Label>First Name</Label>
                            <Input
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                    setErrors((prev) => ({
                                        ...prev,
                                        firstName: undefined,
                                    }))
                                }}
                                error={errors.firstName}
                                shadow={false}
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                            <Label>Last Name (optional)</Label>
                            <Input
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                shadow={false}
                                className="w-full"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                            <Label>Email</Label>
                            <div className="w-full">
                                <Input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className={clsx(
                                        'cursor-not-allowed',
                                        isDark
                                            ? 'bg-[#001E3C] text-[#A1A5B7]'
                                            : 'bg-gray-100 text-[#3F4254]'
                                    )}
                                    shadow={false}
                                />
                                <p className={clsx('text-xs mt-1', textMuted)}>
                                    Email cannot be changed
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            id: 'password',
            label: 'Password',
            content: (
                <div className="p-5 md:p-6">
                    <ChangePasswordForm />
                </div>
            ),
        },
    ]

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8')}>
            <ProfileHeader />

            <div className="flex flex-col gap-[24px] items-start mt-6 w-full">
                <Tabs
                    tabs={tabs}
                    defaultActiveTab="general"
                    tabsClassName={clsx('border-b border-[#1B456F] w-full')}
                />
            </div>
        </div>
    )
}

export default ProfilePage
