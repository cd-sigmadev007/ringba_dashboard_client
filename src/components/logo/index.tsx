import { useThemeStore } from '../../store/themeStore'
import type { FC } from 'react'
import { DarkLogo, LightLogo } from '@/assets/svg'

const Logo: FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    return (
        <div>
            {isDark ? (
                <DarkLogo className="h-8 w-auto" />
            ) : (
                <LightLogo className="h-8 w-auto" />
            )}
        </div>
    )
}

export default Logo
