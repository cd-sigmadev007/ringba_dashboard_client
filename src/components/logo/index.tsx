import { type FC } from 'react';
import DarkLogo from '/logo-dark.svg';
import DarkLogoMobile from '/logo-mobile-dark.svg';
import LightLogo from '/logo-light.svg';
import LightLogoMobile from '/logo-mobile-light.svg';
import { useThemeStore } from '../../store/themeStore';
// import { useSettingsStore } from '../../store/index';
// import { get } from 'lodash';


const Logo: FC = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    return (
        <div>
            <img
                src={isDark ? DarkLogo : LightLogo}
                alt="Logo"
                className="hidden lg:block"
            />
            <img
                src={isDark ? DarkLogoMobile : LightLogoMobile}
                alt="Logo"
                className="lg:hidden"
            />
        </div>
    );
};

export default Logo;
