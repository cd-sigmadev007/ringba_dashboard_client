import { createRoute } from '@tanstack/react-router'
import ProfilePage from '../modules/profile/pages/ProfilePage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/profile',
        component: ProfilePage,
        getParentRoute: () => parentRoute,
    })
