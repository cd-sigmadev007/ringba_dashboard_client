import { type FC } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { DarkLogo, LightLogo } from '@/assets/svg'

const Logo: FC = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    return (
        <div>
            {isDark ? (
                <DarkLogo className="hidden lg:block h-8 w-auto" />
            ) : (
                <LightLogo className="hidden lg:block h-8 w-auto" />
            )}
            {isDark ? (
                <DarkLogo className="lg:hidden h-8 w-auto" />
            ) : (
                <LightLogo className="lg:hidden h-8 w-auto" />
            )}
        </div>
    );
};

export default Logo;
