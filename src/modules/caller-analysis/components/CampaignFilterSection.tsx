import type { SelectOption } from '@/components/ui/FilterSelect'
import { CheckboxIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib'
import { Search } from '@/components/common'
import { useCampaignStore } from '@/modules/org/store/campaignStore'

interface CampaignFilterSectionProps {
    campaigns: Array<SelectOption>
    selectedCampaigns: Array<string>
    onCampaignToggle: (campaignValue: string) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    isLoading: boolean
}

export const CampaignFilterSection: React.FC<CampaignFilterSectionProps> = ({
    campaigns,
    selectedCampaigns,
    onCampaignToggle,
    searchQuery,
    onSearchChange,
    isLoading,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const campaignStore = useCampaignStore((s) => s.campaigns)

    const filteredCampaigns = campaigns.filter((campaign) =>
        (campaign.title ?? '')
            .toLowerCase()
            .includes((searchQuery ?? '').toLowerCase())
    )

    const getCampaignLogo = (campaign: SelectOption) => {
        const campaignData = campaignStore.find(
            (c) =>
                (c.campaign_id && c.campaign_id === campaign.value) ||
                (c.id && c.id === campaign.value) ||
                c.name === campaign.title
        )

        if (campaignData && campaignData.logo_url) {
            const getApiBaseUrl = () => {
                const baseUrl =
                    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
                return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
            }
            const logoUrl = campaignData.logo_url.startsWith('http')
                ? campaignData.logo_url
                : `${getApiBaseUrl()}${
                      campaignData.logo_url.startsWith('/') ? '' : '/'
                  }${campaignData.logo_url}`

            return (
                <div className="size-[20px] rounded-[30px] shrink-0 overflow-hidden">
                    <img
                        src={logoUrl}
                        alt={campaignData.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        }

        const title = campaign.title ?? ''
        const initial = title.toUpperCase().charAt(0)
        const bgColor = (() => {
            let hash = 0
            for (let i = 0; i < title.length; i++) {
                hash = title.charCodeAt(i) + ((hash << 5) - hash)
            }
            const hue = Math.abs(hash) % 360
            const saturation = 30 + (Math.abs(hash) % 21)
            const lightness = 50 + (Math.abs(hash) % 11)
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`
        })()

        return (
            <div
                className="size-[20px] rounded-[30px] shrink-0 flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: bgColor }}
            >
                {initial}
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-[5px] items-start shrink-0">
                <p
                    className={cn(
                        'font-["Poppins:SemiBold",sans-serif]',
                        'leading-[normal] not-italic text-[14px]',
                        'text-[#a1a5b7] text-nowrap uppercase'
                    )}
                >
                    Campaigns
                </p>
                <Search
                    placeholder="Search Campaigns"
                    className="w-full"
                    onSearch={onSearchChange}
                    disableDropdown={true}
                    background="bg-[#132f4c]"
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll flex flex-col gap-[5px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <span className="text-[14px] text-[#a1a5b7]">
                            Loading campaigns...
                        </span>
                    </div>
                ) : (
                    filteredCampaigns.map((campaign) => {
                        const isSelected = selectedCampaigns.includes(
                            campaign.value
                        )
                        return (
                            <button
                                key={campaign.value}
                                onClick={() => onCampaignToggle(campaign.value)}
                                className={cn(
                                    'flex gap-[10px] items-center p-[5px]',
                                    'rounded-[7px] w-full text-left',
                                    'hover:opacity-80 transition-opacity',
                                    'box-border'
                                )}
                            >
                                <CheckboxIcon
                                    checked={isSelected}
                                    isDark={isDark}
                                    className="size-[20px] shrink-0"
                                />
                                <div className="flex gap-[10px] items-center">
                                    {getCampaignLogo(campaign)}
                                    <p
                                        className={cn(
                                            'font-["Poppins:Regular",sans-serif]',
                                            'leading-[normal] not-italic text-[14px]',
                                            'text-[#f5f8fa] text-nowrap'
                                        )}
                                    >
                                        {campaign.title}
                                    </p>
                                </div>
                            </button>
                        )
                    })
                )}
            </div>
        </>
    )
}
