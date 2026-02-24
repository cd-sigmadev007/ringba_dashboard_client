import { createRoute } from '@tanstack/react-router'
import TaggingDashboardPage from '../modules/tagging/pages/TaggingDashboardPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/caller-analysis/tagging',
        component: TaggingDashboardPage,
        getParentRoute: () => parentRoute,
    })
