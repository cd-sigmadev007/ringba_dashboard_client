import { createRoute } from '@tanstack/react-router'
import DeviceRegistrationSuccessPage from '../modules/auth/pages/DeviceRegistrationSuccessPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/device-registration-success',
        component: DeviceRegistrationSuccessPage,
        getParentRoute: () => parentRoute,
    })
