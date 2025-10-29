import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import DashboardPage from '../modules/dashboard/pages/DashboardPage'

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/dashboard',
    component: DashboardPage,
    getParentRoute: () => parentRoute,
  })

