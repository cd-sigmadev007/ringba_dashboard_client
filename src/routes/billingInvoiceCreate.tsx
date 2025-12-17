import { createRoute } from '@tanstack/react-router'
import CreateEditInvoicePage from '../modules/billing/pages/CreateEditInvoicePage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/billing/invoices/new',
        component: CreateEditInvoicePage,
        getParentRoute: () => parentRoute,
    })
