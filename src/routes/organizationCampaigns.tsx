import { createRoute } from '@tanstack/react-router'
import CampaignsPage from '../modules/org/pages/CampaignsPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/organization/campaigns',
        component: CampaignsPage,
        getParentRoute: () => parentRoute,
    })
