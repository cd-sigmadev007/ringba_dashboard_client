// src/layouts/RootLayout.tsx
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'

import Header from './Header'
import Footer from './Footer'
import Aside from './Aside'
import { AuthLayout } from './AuthLayout'
import { useAuth } from '@/contexts/AuthContext'
import { OnboardingModalContainer } from '@/modules/onboarding/containers/OnboardingModalContainer'
import Styles from '@/styles/index'

const AUTH_ROUTES = [
    '/login',
    '/login-otp',
    '/device-registration-success',
    '/forgot-password',
    '/check-email',
    '/reset-password',
    '/password-changed',
]
const protectedRoutes = [
    '/dashboard',
    '/organization',
    '/caller-analysis',
    '/billing',
]

const RootLayout: React.FC = () => {
    const [openMenu, setOpenMenu] = useState(false)
    const { user, loading } = useAuth()
    const isAuthenticated = !!user
    const navigate = useNavigate()
    const location = useLocation()
    const isAuthRoute =
        AUTH_ROUTES.includes(location.pathname) ||
        location.pathname.startsWith('/invite/')

    useEffect(() => {
        if (loading) return
        if (isAuthRoute) return

        if (isAuthenticated && location.pathname === '/') {
            navigate({ to: '/caller-analysis' })
            return
        }

        if (
            !isAuthenticated &&
            protectedRoutes.some((r) => location.pathname.startsWith(r))
        ) {
            navigate({ to: '/login' })
            return
        }

        // Billing routes: only super_admin and org_admin can access
        if (
            isAuthenticated &&
            user &&
            location.pathname.startsWith('/billing') &&
            user.role !== 'super_admin' &&
            user.role !== 'org_admin'
        ) {
            navigate({ to: '/caller-analysis' })
            return
        }

        if (!isAuthenticated && location.pathname === '/') {
            navigate({ to: '/login' })
            return
        }
    }, [isAuthenticated, loading, location.pathname, navigate, isAuthRoute, user])

    if (isAuthRoute) {
        return (
            <Styles>
                <AuthLayout>
                    <Outlet />
                </AuthLayout>
            </Styles>
        )
    }

    const showOnboarding = !!(user && !user.onboardingCompletedAt)

    return (
        <Styles>
            <OnboardingModalContainer
                open={showOnboarding}
                onComplete={() => {}}
            />
            <div
                className={clsx(
                    'min-h-screen overflow-y-auto',
                    openMenu &&
                        'xl:h-screen xl:overflow-y-hidden 2xl:h-auto 2xl:overflow-y-auto'
                )}
            >
                {/* <LoadingBar color="#007FFF" progress={progress} onLoaderFinished={() => setProgress(0)} /> */}
                <Header setOpenMenu={setOpenMenu} openMenu={openMenu} />
                <div className="flex">
                    <Aside openMenu={openMenu} setOpenMenu={setOpenMenu} />
                    <div
                        className={clsx(
                            'xl:ml-64 w-full xl:w-[calc(100vw-256px)] transition-all duration-200 ease-out flex flex-col content'
                        )}
                    >
                        <main className="mt-[110px] lg:mt-[100px] min-h-[calc(100vh-55px)] md:min-h-[calc(100vh-65px)] relative">
                            {openMenu && (
                                <div
                                    className="hidden lg:block xl:hidden absolute inset-0 z-50 bg-black bg-opacity-50"
                                    onClick={() => setOpenMenu(false)}
                                />
                            )}
                            <Outlet />
                        </main>
                        <Footer />
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default RootLayout
