import { createRoute } from '@tanstack/react-router'
import OrgProfilePage from '../modules/org/pages/OrgProfilePage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/organization/profile',
        component: OrgProfilePage,
        getParentRoute: () => parentRoute,
    })
