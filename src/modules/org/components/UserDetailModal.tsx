import React, { useEffect } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { usersApi } from '../services/usersApi'
import { useUserViewAccess } from '../hooks/useUserViewAccess'
import { useUserCampaigns } from '../hooks/useUserCampaigns'
import { useUserRole } from '../hooks/useUserRole'
import {
    getInvitationStatusColor,
    getInvitationStatusLabel,
    getRoleLabel,
    toAbsoluteLogoUrl,
} from '../utils/userUtils'
import { CampaignDisplay } from './CampaignDisplay'
import { CampaignsModal } from './CampaignsModal'
import { DateRangeSelector } from './DateRangeSelector'
import type { UserDto } from '../services/usersApi'
import type { SelectOption } from '@/components/ui/FilterSelect'
import { useThemeStore } from '@/store/themeStore'
import { DeleteIcon } from '@/assets/svg/DeleteIcon'
import Button from '@/components/ui/Button'
import FormSelect from '@/components/ui/FormSelect'
import FilterSelect from '@/components/ui/FilterSelect'

export interface UserDetailModalProps {
    user: UserDto | null
    onClose: () => void
    onUserUpdated?: () => void
    onUserDeleted?: () => void
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
    user,
    onClose,
    onUserUpdated,
    onUserDeleted,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    // View access hook
    const viewAccess = useUserViewAccess({
        userId: user?.id || null,
        onSuccess: onUserUpdated,
        onClose,
    })

    // Campaigns hook
    const campaigns = useUserCampaigns({
        userId: user?.id || null,
        onSuccess: onUserUpdated,
    })

    // Role hook
    const role = useUserRole({
        user: user || null,
        onSuccess: onUserUpdated,
    })

    // Load data on mount
    useEffect(() => {
        if (user) {
            viewAccess.loadViewAccess()
            campaigns.loadUserCampaigns()
            campaigns.loadAvailableCampaigns()
            role.initializeRole(user.role)
        }
    }, [user])

    // Combined save handler
    const handleSaveChanges = async () => {
        if (!user) return

        try {
            // Save role change if it was modified
            if (role.pendingRole !== user.role) {
                await role.saveRoleChange()
            }

            // Save view access
            await viewAccess.handleSaveViewAccess()
        } catch (error: any) {
            // Error handling is done in the hooks
            console.error('Error saving changes:', error)
        }
    }

    const handleDeleteUser = async () => {
        if (!user) return
        if (
            !window.confirm(
                `Are you sure you want to delete user ${user.email}? This action cannot be undone.`
            )
        ) {
            return
        }

        try {
            await usersApi.deleteUser(user.id)
            toast.success('User deleted successfully')
            onUserDeleted?.()
            onClose()
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete user')
        }
    }

    if (!user) {
        return (
            <div className="w-full overflow-y-auto custom-scroll">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No user selected
                </p>
            </div>
        )
    }

    const labelClass = clsx(
        'text-sm w-full max-w-[150px] whitespace-nowrap',
        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
    )
    const valueClass = clsx(
        'text-sm',
        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    )

    const borderClass = clsx(
        'border',
        isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
    )

    const containerBgClass = clsx(isDark ? 'bg-transparent' : 'bg-[#FFFFFF]')

    // Role options for FormSelect
    const roleOptions: Array<SelectOption> = [
        { title: 'Super Admin', value: 'super_admin' },
        { title: 'Media Buyer', value: 'media_buyer' },
    ]

    // Build user info array with editable role and campaigns
    const userInfo = [
        { label: 'Name', value: user.email.split('@')[0] || 'N/A' },
        { label: 'Email', value: user.email },
        { label: 'Phone', value: 'N/A' },
        {
            label: 'Role',
            value: getRoleLabel(user.role),
            editable: true,
            component: (
                <FormSelect
                    options={roleOptions}
                    value={role.pendingRole}
                    onChange={role.handleRoleChange}
                    placeholder="Select role"
                    error={role.assignRoleError || undefined}
                    loading={role.isSaving || viewAccess.savingViewAccess}
                    widthClassName="w-full max-w-[300px]"
                />
            ),
        },
        {
            label: 'Invitation',
            value: getInvitationStatusLabel(user.invitation_status),
            valueClassName: getInvitationStatusColor(
                user.invitation_status,
                isDark
            ),
        },
        {
            label: 'Campaigns',
            value: campaigns.loadingCampaigns
                ? 'Loading...'
                : campaigns.userCampaigns.length > 0
                  ? campaigns.userCampaigns.map((c) => c.name).join(', ')
                  : 'No campaigns assigned',
            editable: true,
            component: (
                <div className="flex-1 flex flex-col gap-3">
                    {!campaigns.isEditingCampaigns ? (
                        <>
                            <CampaignDisplay
                                campaigns={campaigns.userCampaigns}
                                loading={campaigns.loadingCampaigns}
                                isDark={isDark}
                                onViewAll={() =>
                                    campaigns.setShowCampaignsModal(true)
                                }
                                toAbsoluteLogoUrl={toAbsoluteLogoUrl}
                                valueClass={valueClass}
                            />
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    campaigns.setIsEditingCampaigns(true)
                                }
                                className="self-start px-3 py-1.5 text-xs"
                            >
                                Edit
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Edit Mode */}
                            <div className="flex flex-wrap gap-2">
                                {campaigns.userCampaigns.map((campaign) => (
                                    <div
                                        key={campaign.id}
                                        className={clsx(
                                            'flex items-center gap-[5px] px-[7px] py-[5px] rounded-[50px]',
                                            'bg-[#1B456F]'
                                        )}
                                    >
                                        {campaign.logo_url && (
                                            <img
                                                src={toAbsoluteLogoUrl(
                                                    campaign.logo_url
                                                )}
                                                alt={campaign.name}
                                                className="w-5 h-5 rounded-[30px] object-cover"
                                            />
                                        )}
                                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                                            {campaign.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                campaigns.handleRemoveCampaign(
                                                    campaign.id
                                                )
                                            }
                                            disabled={
                                                campaigns.removingCampaignId ===
                                                campaign.id
                                            }
                                            className="ml-1 text-[#F64E60] hover:text-[#F64E60]/80 disabled:opacity-50"
                                            title="Remove campaign"
                                        >
                                            {campaigns.removingCampaignId ===
                                            campaign.id ? (
                                                <span className="text-xs">
                                                    Removing...
                                                </span>
                                            ) : (
                                                <DeleteIcon className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Assign New Campaigns - Multiselect */}
                            {campaigns.campaignOptions.length > 0 && (
                                <div className="flex gap-2 items-center">
                                    <div className="flex-1 max-w-[300px]">
                                        <FilterSelect
                                            defaultValue={{
                                                title: 'Select campaigns',
                                                value: '',
                                            }}
                                            filterList={
                                                campaigns.campaignOptions
                                            }
                                            setFilter={(value) => {
                                                if (Array.isArray(value)) {
                                                    campaigns.setSelectedCampaignIds(
                                                        value
                                                    )
                                                }
                                            }}
                                            multiple={true}
                                            selectedValues={
                                                campaigns.selectedCampaignIds
                                            }
                                            className={
                                                campaigns.loadingAvailableCampaigns
                                                    ? 'opacity-60 pointer-events-none'
                                                    : ''
                                            }
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={
                                            campaigns.handleAssignCampaigns
                                        }
                                        disabled={
                                            campaigns.selectedCampaignIds
                                                .length === 0 ||
                                            campaigns.assigningCampaigns
                                        }
                                        className="px-3 py-1.5 text-xs"
                                    >
                                        {campaigns.assigningCampaigns
                                            ? 'Assigning...'
                                            : 'Assign'}
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        campaigns.setIsEditingCampaigns(false)
                                        campaigns.setSelectedCampaignIds([])
                                    }}
                                    className="px-3 py-1.5 text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            ),
        },
    ]

    return (
        <div className="w-full overflow-y-auto custom-scroll h-full">
            <h2
                className={clsx(
                    'text-md font-semibold mb-6',
                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                )}
            >
                Basic Details
            </h2>

            {/* User Info */}
            <div
                className={clsx(
                    'flex flex-col rounded-sm mb-6',
                    containerBgClass,
                    borderClass
                )}
            >
                {userInfo.map((item, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            'flex p-3.5 items-start gap-x-[32px] border-b last:border-b-0',
                            isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                        )}
                    >
                        <p className={labelClass}>{item.label}</p>
                        {item.editable ? (
                            <div className="flex-1">{item.component}</div>
                        ) : (
                            <p
                                className={clsx(
                                    valueClass,
                                    item.valueClassName || ''
                                )}
                            >
                                {item.value}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* User Permissions Section */}
            <div className="flex flex-col gap-4 mb-6">
                <p
                    className={clsx(
                        'text-[16px] font-normal',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    User Permissions
                </p>

                <div
                    className={clsx(
                        'flex flex-col rounded-[7px] border',
                        isDark
                            ? 'border-[#1B456F] bg-transparent'
                            : 'border-[#E1E5E9] bg-white'
                    )}
                >
                    {viewAccess.loadingViewAccess ? (
                        <div className="p-4 text-center">
                            <p className={valueClass}>Loading view access...</p>
                        </div>
                    ) : (
                        <div className="p-[14px] space-y-4">
                            {/* Data Access Scope Row */}
                            <div className="flex gap-[32px] items-start">
                                <p
                                    className={clsx(
                                        'text-[12px] font-medium w-[120px] shrink-0 pt-2',
                                        isDark
                                            ? 'text-[#A1A5B7]'
                                            : 'text-[#5E6278]'
                                    )}
                                >
                                    Data Access Scope
                                </p>
                                <div className="flex-1 flex flex-col gap-4">
                                    {/* Full Access Switch */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={
                                                viewAccess.isFullAccess
                                            }
                                            onClick={
                                                viewAccess.handleToggleFullAccess
                                            }
                                            className={clsx(
                                                'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none',
                                                viewAccess.isFullAccess
                                                    ? 'bg-[#007FFF]'
                                                    : clsx(
                                                          isDark
                                                              ? 'bg-[#1B456F]'
                                                              : 'bg-[#E1E5E9]'
                                                      )
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out',
                                                    viewAccess.isFullAccess
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                )}
                                            />
                                        </button>
                                        <div className="flex flex-col">
                                            <span
                                                className={clsx(
                                                    'text-[14px] font-medium',
                                                    valueClass
                                                )}
                                            >
                                                Full Access
                                            </span>
                                        </div>
                                    </div>

                                    {/* Date Range Selector */}
                                    <DateRangeSelector
                                        dateRange={viewAccess.dateRange}
                                        isFullAccess={viewAccess.isFullAccess}
                                        isDark={isDark}
                                        showDatePicker={
                                            viewAccess.showDatePicker
                                        }
                                        activePreset={viewAccess.activePreset}
                                        tempDateRange={viewAccess.tempDateRange}
                                        datePickerRef={viewAccess.datePickerRef}
                                        onOpenDatePicker={
                                            viewAccess.handleOpenDatePicker
                                        }
                                        onPresetClick={
                                            viewAccess.handlePresetClick
                                        }
                                        onDateSelect={
                                            viewAccess.handleDateSelect
                                        }
                                        onClearDateRange={
                                            viewAccess.handleClearDateRange
                                        }
                                        onDoneDateRange={
                                            viewAccess.handleDoneDateRange
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons - Save Changes and Delete User */}
            <div className="flex items-center justify-between pt-4">
                <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    disabled={viewAccess.savingViewAccess || role.isSaving}
                >
                    {viewAccess.savingViewAccess || role.isSaving
                        ? 'Saving...'
                        : 'Save Changes'}
                </Button>
                <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="flex items-center gap-[5px]"
                >
                    <DeleteIcon className="w-5 h-5 text-[#F64E60]" />
                    <p className="text-[14px] font-normal text-[#F64E60]">
                        Delete User
                    </p>
                </button>
            </div>

            {/* Campaigns Modal */}
            <CampaignsModal
                open={campaigns.showCampaignsModal}
                onClose={() => campaigns.setShowCampaignsModal(false)}
                campaigns={campaigns.userCampaigns}
                isDark={isDark}
                toAbsoluteLogoUrl={toAbsoluteLogoUrl}
            />
        </div>
    )
}
