import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from '@tanstack/react-router'
import { ProfilePictureUpload } from '../components/ProfilePictureUpload'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

const ProfilePage: React.FC = () => {
    const { user, updateProfile, refetchMe } = useAuth()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const navigate = useNavigate()

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const fn = firstName.trim()
        if (!fn) {
            setErrors({ firstName: 'First name is required' })
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

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    if (!user) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className={`text-2xl font-semibold mb-6 ${textClr}`}>
                    Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-[#002B57] rounded-lg p-6 shadow-sm">
                        <h2 className={`text-lg font-medium mb-4 ${textClr}`}>
                            Profile Picture
                        </h2>
                        <ProfilePictureUpload
                            currentPictureUrl={user.profilePictureUrl}
                            onPictureChange={setProfilePicture}
                        />
                        {profilePicture && (
                            <p className={`text-xs mt-2 ${textMuted}`}>
                                New picture will be saved when you click "Save
                                Changes"
                            </p>
                        )}
                    </div>

                    <div className="bg-white dark:bg-[#002B57] rounded-lg p-6 shadow-sm space-y-4">
                        <h2 className={`text-lg font-medium mb-4 ${textClr}`}>
                            Personal Information
                        </h2>

                        <div>
                            <Input
                                label="First Name"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                    setErrors((prev) => ({
                                        ...prev,
                                        firstName: undefined,
                                    }))
                                }}
                                placeholder="Enter first name"
                                error={errors.firstName}
                                required
                            />
                        </div>

                        <div>
                            <Input
                                label="Last Name (optional)"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter last name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email}
                                disabled
                                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                            />
                            <p className={`text-xs mt-1 ${textMuted}`}>
                                Email cannot be changed
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate({ to: '/' })}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfilePage
