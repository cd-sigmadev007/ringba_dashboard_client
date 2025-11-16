import { createRoute } from '@tanstack/react-router'
import DashboardPage from '../modules/dashboard/pages/DashboardPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/dashboard',
        component: DashboardPage,
        getParentRoute: () => parentRoute,
    })
