// src/layouts/RootLayout.tsx
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'

// import LoadingBar from 'react-top-loading-bar';
import Header from './Header'
import Footer from './Footer'
import Aside from './Aside'
import Styles from '@/styles/index'

const RootLayout: React.FC = () => {
    const [openMenu, setOpenMenu] = useState(false)
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/organization', '/caller-analysis']
    const isLoginPage = location.pathname === '/login'
    const isCallbackPage = location.pathname === '/callback'

    useEffect(() => {
        // Don't redirect if still loading or already on callback/login page
        if (isLoading) return
        if (isCallbackPage || isLoginPage) return

        const isProtectedRoute = protectedRoutes.some((route) =>
            location.pathname.startsWith(route)
        )

        // If user is authenticated and on root path, redirect to caller analysis
        if (isAuthenticated && location.pathname === '/') {
            navigate({ to: '/caller-analysis' })
            return
        }

        // If user is not authenticated and trying to access protected route, redirect to login
        if (isProtectedRoute && !isAuthenticated) {
            navigate({ to: '/login' })
            return
        }
    }, [
        isAuthenticated,
        isLoading,
        location.pathname,
        navigate,
        isLoginPage,
        isCallbackPage,
    ])

    return (
        <Styles>
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
                    {!isLoginPage && (
                        <Aside openMenu={openMenu} setOpenMenu={setOpenMenu} />
                    )}
                    <div
                        className={clsx(
                            !isLoginPage && 'xl:ml-64 w-full xl:w-[calc(100vw-256px)]',
                            isLoginPage && 'w-full',
                            'transition-all duration-200 ease-out flex flex-col content'
                        )}
                    >
                        <main
                            className={clsx(
                                !isLoginPage &&
                                    'mt-[110px] lg:mt-[100px] min-h-[calc(100vh-55px)] md:min-h-[calc(100vh-65px)]',
                                'relative'
                            )}
                        >
                            {openMenu && !isLoginPage && (
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
