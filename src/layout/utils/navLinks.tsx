import { BuildingIcon, PhoneIcon } from '../../assets/svg'

export interface NavLinkItem {
    id: string | number
    title: string
    path?: string
    disable?: boolean
    icon?: React.ReactNode
    submenu?: Array<{
        id: string | number
        title: string
        path: string
        disable?: boolean
    }>
}

export const navLinks: Array<NavLinkItem> = [
    {
        id: 1212351233,
        title: 'Caller Analysis',
        path: '/caller-analysis',
        disable: false,
        icon: <PhoneIcon />,
    },
    {
        id: 99887766,
        title: 'Organization',
        disable: false,
        icon: <BuildingIcon />,
        submenu: [
            {
                id: 'org-profile',
                title: 'Profile',
                path: '/organization/profile',
                disable: false,
            },
            {
                id: 'org-users',
                title: 'Manage Users',
                path: '/organization/users',
                disable: false,
            },
            {
                id: 'org-campaigns',
                title: 'Campaigns',
                path: '/organization/campaigns',
                disable: false,
            },
        ],
    },
]
