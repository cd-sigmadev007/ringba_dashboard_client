import { createRoute } from '@tanstack/react-router'
import CreateEditCampaignPage from '../modules/org/pages/CreateEditCampaignPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/organization/campaigns/$campaignId',
        component: CreateEditCampaignPage,
        getParentRoute: () => parentRoute,
    })
