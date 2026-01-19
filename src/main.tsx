import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
    RouterProvider,
    createRootRoute,
    createRouter,
} from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import TanStackQueryDemo from './routes/demo.tanstack-query.tsx'
import CallerAnalysis from './routes/caller-analysis.tsx'
import ApiDemo from './routes/api-demo.tsx'
import DashboardRoute from './routes/dashboard.tsx'
import OrganizationRoute from './routes/organization.tsx'
import OrganizationCampaignsRoute from './routes/organizationCampaigns.tsx'
import OrganizationUsersRoute from './routes/organizationUsers.tsx'
import CreateCampaignRoute from './routes/createCampaign.tsx'
import EditCampaignRoute from './routes/editCampaign.tsx'
import BillingOrganizationsRoute from './routes/billingOrganizations.tsx'
import BillingCustomersRoute from './routes/billingCustomers.tsx'
import BillingInvoicesRoute from './routes/billingInvoices.tsx'
import BillingInvoiceCreateRoute from './routes/billingInvoiceCreate.tsx'
import BillingInvoiceEditRoute from './routes/billingInvoiceEdit.tsx'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

import reportWebVitals from './reportWebVitals.ts'

import RootLayout from './layout/Index.tsx'
import LoginRoute from './routes/login'
import LoginOtpRoute from './routes/loginOtp'
import DeviceRegistrationSuccessRoute from './routes/deviceRegistrationSuccess'
import ForgotPasswordRoute from './routes/forgotPassword'
import CheckEmailRoute from './routes/checkEmail'
import ResetPasswordRoute from './routes/resetPassword'
import PasswordChangedRoute from './routes/passwordChanged'
import InviteRoute from './routes/invite.$token'
import { ApiClientSetup } from './services/api/setupApiClient'
import { AuthProvider } from '@/contexts/AuthContext'

// Initialize theme on app startup
const savedTheme = localStorage.getItem('theme') || 'dark'
document.documentElement.classList.add(
    savedTheme === 'dark' ? 'theme-dark' : 'theme-light'
)

const rootRoute = createRootRoute({
    component: RootLayout,
})

const routeTree = rootRoute.addChildren([
    LoginRoute(rootRoute),
    LoginOtpRoute(rootRoute),
    DeviceRegistrationSuccessRoute(rootRoute),
    ForgotPasswordRoute(rootRoute),
    CheckEmailRoute(rootRoute),
    ResetPasswordRoute(rootRoute),
    PasswordChangedRoute(rootRoute),
    InviteRoute(rootRoute),
    DashboardRoute(rootRoute),
    TanStackQueryDemo(rootRoute),
    CallerAnalysis(rootRoute),
    ApiDemo(rootRoute),
    OrganizationRoute(rootRoute),
    OrganizationCampaignsRoute(rootRoute),
    OrganizationUsersRoute(rootRoute),
    CreateCampaignRoute(rootRoute),
    EditCampaignRoute(rootRoute),
    BillingOrganizationsRoute(rootRoute),
    BillingCustomersRoute(rootRoute),
    BillingInvoicesRoute(rootRoute),
    BillingInvoiceCreateRoute(rootRoute),
    BillingInvoiceEditRoute(rootRoute),
])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
    routeTree,
    context: {
        ...TanStackQueryProviderContext,
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
})

function PreloadProviders({ children }: { children: React.ReactNode }) {
    // Removed fetchCampaigns call - campaigns should be fetched by individual pages
    // after authentication is ready to avoid race conditions
    return <>{children}</>
}

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <StrictMode>
            <AuthProvider>
                <TanStackQueryProvider.Provider
                    {...TanStackQueryProviderContext}
                >
                    <ApiClientSetup>
                        <PreloadProviders>
                            <RouterProvider router={router} />
                        </PreloadProviders>
                        <Toaster
                            position="bottom-center"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: 'var(--toast-bg, #363636)',
                                    color: 'var(--toast-color, #fff)',
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: '#4ade80',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    duration: 5000,
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </ApiClientSetup>
                </TanStackQueryProvider.Provider>
            </AuthProvider>
        </StrictMode>
    )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
