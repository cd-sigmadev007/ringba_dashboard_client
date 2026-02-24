import { BillingIcon, BuildingIcon, PhoneIcon } from '../../assets/svg'

export interface NavLinkItem {
    id: string | number
    title: string
    path?: string
    disable?: boolean
    icon?: React.ReactNode
    hideForRoles?: Array<string> // Roles that should not see this menu item
    submenu?: Array<{
        id: string | number
        title: string
        path: string
        disable?: boolean
        hideForRoles?: Array<string> // Roles that should not see this menu item
    }>
}

export const navLinks: Array<NavLinkItem> = [
    {
        id: 1212351233,
        title: 'Caller Analysis',
        disable: false,
        icon: <PhoneIcon />,
        submenu: [
            {
                id: 'caller-analysis-list',
                title: 'Call List',
                path: '/caller-analysis',
                disable: false,
            },
            {
                id: 'caller-analysis-tagging',
                title: 'Tagging Dashboard',
                path: '/caller-analysis/tagging',
                disable: false,
            },
            {
                id: 'caller-analysis-visualizer',
                title: 'Query Builder',
                path: '/visualizer',
                disable: false,
            },
        ],
    },
    {
        id: 99887766,
        title: 'Organization',
        disable: false,
        icon: <BuildingIcon />,
        submenu: [
            {
                id: 'org-profile',
                title: 'Settings',
                path: '/organization/profile',
                disable: false,
            },
            {
                id: 'org-users',
                title: 'Manage Users',
                path: '/organization/users',
                disable: false,
                hideForRoles: ['media_buyer'], // Hide for media buyers
            },
            {
                id: 'org-campaigns',
                title: 'Campaigns',
                path: '/organization/campaigns',
                disable: false,
            },
        ],
    },
    {
        id: 99887767,
        title: 'Billing',
        disable: false,
        icon: <BillingIcon />,
        hideForRoles: ['media_buyer'], // Only super_admin and org_admin can see billing
        submenu: [
            {
                id: 'billing-invoices',
                title: 'Invoices',
                path: '/billing/invoices',
                disable: false,
            },
            {
                id: 'billing-customers',
                title: 'Customers',
                path: '/billing/customers',
                disable: false,
            },
            {
                id: 'billing-organizations',
                title: 'Organizations',
                path: '/billing/organizations',
                disable: false,
            },
        ],
    },
]
