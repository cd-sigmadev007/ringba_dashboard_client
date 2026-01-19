import { createRoute } from '@tanstack/react-router'
import InvitePage from '../modules/auth/pages/InvitePage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/invite/$token',
        component: InvitePage,
        getParentRoute: () => parentRoute,
    })
