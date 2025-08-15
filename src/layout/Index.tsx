// src/layouts/RootLayout.tsx
import React, { useState } from 'react'
import clsx from 'clsx'
import { Outlet } from '@tanstack/react-router'

// import LoadingBar from 'react-top-loading-bar';
import Header from './Header'
import Footer from './Footer'
import Aside from './Aside'
import Styles from '@/styles/index'

const RootLayout: React.FC = () => {
    const [openMenu, setOpenMenu] = useState(false)

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
