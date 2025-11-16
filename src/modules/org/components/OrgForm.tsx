import React from 'react'
import clsx from 'clsx'
import { fetchCountries, lookupPostalZippopotam } from '../services/locationApi'
import { orgZSchema } from '../validation/orgSchemas'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { useThemeStore } from '@/store/themeStore'
import FormSelect from '@/components/ui/FormSelect'
import { GlobeIcon } from '@/assets/svg'
import Button from '@/components/ui/Button'

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
)

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

// Removed CardInput for selects/textarea per design; inputs use direct bg/width classes

const OrgBasicInfoForm: React.FC<{ onSave: () => void }> = ({ onSave }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [countries, setCountries] = React.useState<
        Array<{ title: string; value: string }>
    >([])
    const [values, setValues] = React.useState({
        orgName: '',
        description: '',
        country: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        website: '',
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [loadingPostal, setLoadingPostal] = React.useState(false)
    const [lastLookedUpPostal, setLastLookedUpPostal] =
        React.useState<string>('')

    React.useEffect(() => {
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

    const setField =
        (key: keyof typeof values) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const val = e.target.value
            setValues((v) => ({ ...v, [key]: val }))
            if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
            // Reset postal lookup cache when postal code changes
            if (key === 'postalCode') {
                setLastLookedUpPostal('')
            }
        }

    const validateAndSetErrors = () => {
        const parsed = orgZSchema.safeParse(values)
        if (!parsed.success) {
            const e: Record<string, string> = {}
            parsed.error.issues.forEach((i) => {
                const k = String(i.path[0])
                e[k] = i.message
            })
            setErrors(e)
            return false
        }
        setErrors({})
        return true
    }

    const handleSave = async () => {
        if (!validateAndSetErrors()) return
        // TODO: integrate with orgStore.updateOrganization(values)
        await Promise.resolve().then(() =>
            console.log('Org Profile submit:', values)
        )
        onSave()
    }

    return (
        <div className="space-y-6 ">
            {/* Organization Name */}
            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <Label>Organization Name</Label>
                <Input
                    placeholder="Organization name"
                    value={values.orgName}
                    onChange={setField('orgName')}
                    error={errors['orgName']}
                    shadow={false}
                    className="w-full"
                />
            </div>

            {/* Description */}
            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <Label>Description</Label>
                <TextArea
                    placeholder="Enter Organization description"
                    className={clsx(
                        isDark
                            ? 'bg-[#002B57] text-[#A1A5B7] placeholder-[#A1A5B7]'
                            : 'bg-white'
                    )}
                    value={values.description}
                    onChange={setField('description')}
                    error={errors['description']}
                    rows={6}
                    shadow={false}
                />
            </div>

            <div className="horizontal-line my-4"></div>

            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <Label>Organization Location</Label>
                <FormSelect
                    className={clsx(
                        // Match card background and remove blue focus border; keep subtle border only on light
                        isDark
                            ? 'bg-[#002B57] text-[#A1A5B7] border-transparent hover:!border-transparent focus:!border-transparent'
                            : 'bg-white text-[#3F4254] border-[#ECECEC] hover:!border-[#ECECEC] focus:!border-[#ECECEC]'
                    )}
                    options={countries}
                    value={values.country}
                    placeholder="Select Country"
                    onChange={(val) => {
                        setValues((v) => ({ ...v, country: val }))
                        if (errors['country'])
                            setErrors((e) => ({ ...e, country: '' }))
                        // Reset postal lookup cache when country changes
                        setLastLookedUpPostal('')
                    }}
                    error={errors['country']}
                />
            </div>

            <div className="flex flex-col items-start gap-[10px] w-full max-w-[720px]">
                {/* Address textarea row with label */}
                <div className="flex items-start max-md:flex-col gap-[10px] w-full">
                    <Label>Organization Address</Label>
                    <TextArea
                        placeholder="Enter Organization address"
                        className={clsx(
                            isDark
                                ? 'bg-[#002B57] text-[#A1A5B7] placeholder-[#A1A5B7]'
                                : 'bg-white'
                        )}
                        value={values.address}
                        onChange={setField('address')}
                        error={errors['address']}
                        rows={6}
                        shadow={false}
                    />
                </div>
                {/* Subsequent aligned inputs under the same label column */}
                <div className="flex items-start max-md:flex-col gap-[10px] w-full">
                    {/* spacer to align with label column (220px) */}
                    <Label>{''}</Label>
                    <div className="grid grid-cols-2 gap-[10px] w-full">
                        <FormSelect
                            placeholder="City"
                            options={[
                                {
                                    title: values.city || 'City',
                                    value: values.city,
                                },
                            ]}
                            value={values.city}
                            loading={loadingPostal}
                            className={clsx(
                                isDark
                                    ? 'bg-[#002B57] text-[#A1A5B7] border-transparent hover:!border-transparent focus:!border-transparent'
                                    : 'bg-white text-[#3F4254] border-[#ECECEC] hover:!border-[#ECECEC] focus:!border-[#ECECEC]'
                            )}
                            onChange={(val) => {
                                setValues((v) => ({ ...v, city: val }))
                                if (errors['city'])
                                    setErrors((e) => ({ ...e, city: '' }))
                            }}
                            error={errors['city']}
                        />
                        <Input
                            placeholder="Enter Postal / Zip"
                            value={values.postalCode}
                            onChange={setField('postalCode')}
                            onBlur={async () => {
                                const postalKey = `${values.country}-${values.postalCode}`
                                // Only lookup if country/postal changed and both are present
                                if (
                                    values.country &&
                                    values.postalCode &&
                                    postalKey !== lastLookedUpPostal
                                ) {
                                    setLoadingPostal(true)
                                    try {
                                        const res =
                                            await lookupPostalZippopotam(
                                                values.country.toLowerCase(),
                                                values.postalCode
                                            )
                                        if (res) {
                                            setValues((v) => ({
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
                            error={errors['postalCode']}
                            rightIcon={loadingPostal ? <Spinner /> : undefined}
                            shadow={false}
                            className="w-full"
                        />
                        <FormSelect
                            placeholder="State"
                            options={[
                                {
                                    title: values.state || 'State / Province',
                                    value: values.state,
                                },
                            ]}
                            value={values.state}
                            loading={loadingPostal}
                            className={clsx(
                                // Match background tokens
                                isDark
                                    ? 'bg-[#002B57] text-[#A1A5B7] border-transparent hover:!border-transparent focus:!border-transparent'
                                    : 'bg-white text-[#3F4254] border-[#ECECEC] hover:!border-[#ECECEC] focus:!border-[#ECECEC]'
                            )}
                            onChange={(val) => {
                                setValues((v) => ({ ...v, state: val }))
                                if (errors['state'])
                                    setErrors((e) => ({ ...e, state: '' }))
                            }}
                            error={errors['state']}
                        />
                        <Input
                            placeholder="Phone"
                            value={values.phone}
                            onChange={setField('phone')}
                            shadow={false}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="horizontal-line my-4"></div>

            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <Label>Website URL</Label>
                <Input
                    placeholder="Enter Website URL"
                    leftIcon={<GlobeIcon />}
                    value={values.website}
                    onChange={setField('website')}
                    error={errors['website']}
                    shadow={false}
                    className="w-full"
                />
            </div>
            <Button variant="secondary" onClick={handleSave}>
                Save Changes
            </Button>
        </div>
    )
}

export default OrgBasicInfoForm
