import { createRoute } from '@tanstack/react-router'
import OrganizationsPage from '../modules/billing/pages/OrganizationsPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/billing/organizations',
        component: OrganizationsPage,
        getParentRoute: () => parentRoute,
    })

