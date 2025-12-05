import { createRoute } from '@tanstack/react-router'
import InvoicesPage from '../modules/billing/pages/InvoicesPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/billing/invoices',
        component: InvoicesPage,
        getParentRoute: () => parentRoute,
    })
