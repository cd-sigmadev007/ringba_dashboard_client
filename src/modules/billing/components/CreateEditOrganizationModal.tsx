/**
 * Create/Edit Organization Modal
 * Matches Figma design (node-id: 4643-11272)
 */

import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
    useCreateOrganization,
    useUpdateOrganization,
} from '../hooks/useOrganizations'
import type {
    CreateOrganizationRequest,
    Organization,
    UpdateOrganizationRequest,
} from '../types'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import Button from '@/components/ui/Button'
import FormSelect from '@/components/ui/FormSelect'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'
import {
    fetchCountries,
    lookupPostalZippopotam,
} from '@/modules/org/services/locationApi'

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
)

interface CreateEditOrganizationModalProps {
    isOpen: boolean
    onClose: () => void
    organization?: Organization | null
}

// Common country codes for phone numbers
const COUNTRY_CODES = [
    { title: '+1', value: '+1' },
    { title: '+44', value: '+44' },
    { title: '+91', value: '+91' },
    { title: '+372', value: '+372' },
    { title: '+33', value: '+33' },
    { title: '+49', value: '+49' },
    { title: '+81', value: '+81' },
    { title: '+86', value: '+86' },
    { title: '+61', value: '+61' },
    { title: '+7', value: '+7' },
]

export const CreateEditOrganizationModal: React.FC<
    CreateEditOrganizationModalProps
> = ({ isOpen, onClose, organization }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()
    const isEditMode = !!organization

    const [formData, setFormData] = useState<CreateOrganizationRequest>({
        name: '',
        email: '',
        country_code: '',
        phone_number: '',
        billing_address: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        gst_vat_tax_id: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [countries, setCountries] = useState<
        Array<{ title: string; value: string }>
    >([])
    const [loadingPostal, setLoadingPostal] = useState(false)
    const [lastLookedUpPostal, setLastLookedUpPostal] = useState<string>('')

    const createMutation = useCreateOrganization()
    const updateMutation = useUpdateOrganization()

    // Fetch countries on mount
    useEffect(() => {
        let mounted = true
        fetchCountries().then((list) => {
            if (!mounted) return
            setCountries(
                [{ title: 'Select Country', value: '' }].concat(
                    list.map((c) => ({ title: c.name, value: c.code }))
                )
            )
        })
        return () => {
            mounted = false
        }
    }, [])

    // Populate form when editing
    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                email: organization.email || '',
                country_code: organization.country_code || '',
                phone_number: organization.phone_number || '',
                billing_address: organization.billing_address || '',
                country: organization.country || '',
                state: organization.state || '',
                city: organization.city || '',
                postal_code: organization.postal_code || '',
                gst_vat_tax_id: organization.gst_vat_tax_id || '',
            })
        } else {
            // Reset form for create mode
            setFormData({
                name: '',
                email: '',
                country_code: '',
                phone_number: '',
                billing_address: '',
                country: '',
                state: '',
                city: '',
                postal_code: '',
                gst_vat_tax_id: '',
            })
            setLastLookedUpPostal('')
        }
        setErrors({})
    }, [organization, isOpen])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Company name is required'
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = 'Invalid email format'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            if (isEditMode && organization) {
                const updateData: UpdateOrganizationRequest = {
                    name: formData.name,
                    email: formData.email || undefined,
                    country_code: formData.country_code || undefined,
                    phone_number: formData.phone_number || undefined,
                    billing_address: formData.billing_address || undefined,
                    country: formData.country || undefined,
                    state: formData.state || undefined,
                    city: formData.city || undefined,
                    postal_code: formData.postal_code || undefined,
                    gst_vat_tax_id: formData.gst_vat_tax_id || undefined,
                }
                await updateMutation.mutateAsync({
                    id: organization.id,
                    data: updateData,
                })
            } else {
                await createMutation.mutateAsync(formData)
            }
            onClose()
        } catch (error) {
            // Error handling is done in the mutation hooks
        }
    }

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            country_code: '',
            phone_number: '',
            billing_address: '',
            country: '',
            state: '',
            city: '',
            postal_code: '',
            gst_vat_tax_id: '',
        })
        setErrors({})
        setLastLookedUpPostal('')
        onClose()
    }

    const isLoading = createMutation.isPending || updateMutation.isPending

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Organization' : 'New Organization'}
            size={isMobile ? 'full' : 'md'}
            position={isMobile ? 'bottom' : 'center'}
            animation={isMobile ? 'slide' : 'fade'}
            className={clsx(
                isDark ? 'bg-[#071B2F]' : 'bg-white',
                isMobile
                    ? 'w-full h-[70vh] rounded-t-[10px]'
                    : 'w-[70vw] max-h-[70vh] overflow-y-auto'
            )}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                {/* Company Name */}
                <div className="flex flex-col gap-[14px]">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Company Name
                    </label>
                    <Input
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value })
                            if (errors.name) setErrors({ ...errors, name: '' })
                        }}
                        placeholder="Enter company name"
                        error={errors.name}
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Company Email */}
                <div className="flex flex-col gap-[14px]">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Company Email
                    </label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value })
                            if (errors.email)
                                setErrors({ ...errors, email: '' })
                        }}
                        placeholder="Enter company email"
                        error={errors.email}
                        disabled={isLoading}
                    />
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-[14px]">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Contact Number
                    </label>
                    <div className="flex gap-[14px]">
                        <FormSelect
                            className={clsx(
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                                    : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            )}
                            options={COUNTRY_CODES}
                            value={formData.country_code}
                            placeholder="+91"
                            onChange={(value) => {
                                setFormData({
                                    ...formData,
                                    country_code: value,
                                })
                            }}
                            widthClassName="w-auto min-w-[80px]"
                        />
                        <Input
                            value={formData.phone_number}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    phone_number: e.target.value,
                                })
                            }}
                            placeholder="9876511223"
                            disabled={isLoading}
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Billing Address */}
                <div className="flex flex-col gap-[14px]">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Billing Address
                    </label>
                    <TextArea
                        value={formData.billing_address}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                billing_address: e.target.value,
                            })
                        }}
                        placeholder="Enter billing address"
                        rows={4}
                        disabled={isLoading}
                        className={clsx(
                            'h-[112px]',
                            isDark
                                ? 'bg-[#002B57] text-[#F5F8FA]'
                                : 'bg-[#002B57] text-[#F5F8FA]'
                        )}
                    />
                    <div className="flex gap-[14px] flex-wrap">
                        <FormSelect
                            className={clsx(
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                                    : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            )}
                            options={countries}
                            value={formData.country}
                            placeholder="Select Country"
                            onChange={(value) => {
                                setFormData({ ...formData, country: value })
                                // Reset postal lookup cache when country changes
                                setLastLookedUpPostal('')
                            }}
                            widthClassName="min-w-[160px] flex-1"
                        />
                        <FormSelect
                            className={clsx(
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                                    : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            )}
                            options={[
                                {
                                    title: formData.state || 'State / Province',
                                    value: formData.state || '',
                                },
                            ]}
                            value={formData.state || ''}
                            placeholder="State"
                            loading={loadingPostal}
                            onChange={(value) => {
                                setFormData({ ...formData, state: value })
                            }}
                            widthClassName="min-w-[160px] flex-1"
                        />
                        <FormSelect
                            className={clsx(
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                                    : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            )}
                            options={[
                                {
                                    title: formData.city || 'City',
                                    value: formData.city || '',
                                },
                            ]}
                            value={formData.city || ''}
                            placeholder="City"
                            loading={loadingPostal}
                            onChange={(value) => {
                                setFormData({ ...formData, city: value })
                            }}
                            widthClassName="min-w-[160px] flex-1"
                        />
                        <Input
                            value={formData.postal_code}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    postal_code: e.target.value,
                                })
                                // Reset postal lookup cache when postal code changes
                                setLastLookedUpPostal('')
                            }}
                            onBlur={async () => {
                                const postalKey = `${formData.country}-${formData.postal_code}`
                                // Only lookup if country/postal changed and both are present
                                if (
                                    formData.country &&
                                    formData.postal_code &&
                                    postalKey !== lastLookedUpPostal
                                ) {
                                    setLoadingPostal(true)
                                    try {
                                        const res =
                                            await lookupPostalZippopotam(
                                                formData.country.toLowerCase(),
                                                formData.postal_code
                                            )
                                        if (res) {
                                            setFormData((v) => ({
                                                ...v,
                                                city: res.city || v.city || '',
                                                state:
                                                    res.state || v.state || '',
                                            }))
                                            setLastLookedUpPostal(postalKey)
                                        }
                                    } catch (err) {
                                        console.error(
                                            'Postal lookup failed:',
                                            err
                                        )
                                    } finally {
                                        setLoadingPostal(false)
                                    }
                                }
                            }}
                            placeholder="Postal Code"
                            disabled={isLoading}
                            className="min-w-[160px] flex-1"
                            rightIcon={loadingPostal ? <Spinner /> : undefined}
                        />
                    </div>
                </div>

                {/* GST / VAT / Tax ID */}
                <div className="flex flex-col gap-[14px]">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        GST / VAT / Tax ID
                    </label>
                    <Input
                        value={formData.gst_vat_tax_id}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                gst_vat_tax_id: e.target.value,
                            })
                        }}
                        placeholder="Enter tax ID"
                        disabled={isLoading}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    variant="primary"
                    disabled={isLoading}
                    className={clsx(
                        'w-full justify-center',
                        isDark ? 'bg-[#007FFF]' : 'bg-[#007FFF]'
                    )}
                >
                    {isEditMode ? 'Update Organization' : 'Add New Org'}
                </Button>
            </form>
        </Modal>
    )
}
