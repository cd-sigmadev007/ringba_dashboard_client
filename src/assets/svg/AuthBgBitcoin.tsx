import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const AuthBgBitcoin: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const iconColor = isDark ? '#5E8FC7' : '#7E8299'
    const iconOpacity = isDark ? '0.3' : '0.2'

    return (
        <svg
            width="61"
            height="90"
            viewBox="0 0 61 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <g opacity={iconOpacity}>
                <path
                    d="M-4.37589 31.1952C-6.14357 33.8258 -7.37581 36.7787 -8.00226 39.8855C-8.62872 42.9922 -8.63712 46.1919 -8.02698 49.3019C-7.41685 52.4119 -6.20013 55.3713 -4.4463 58.0111C-2.69246 60.6509 -0.435857 62.9194 2.19467 64.687C4.82521 66.4547 7.77815 67.6869 10.8849 68.3134C13.9917 68.9399 17.1914 68.9483 20.3014 68.3381C23.4114 67.728 26.3708 66.5113 29.0105 64.7574C31.6503 63.0036 33.9188 60.747 35.6865 58.1165C37.4541 55.4859 38.6864 52.533 39.3128 49.4262C39.9393 46.3195 39.9477 43.1198 39.3376 40.0098C38.7274 36.8998 37.5107 33.9404 35.7569 31.3006C34.003 28.6608 31.7464 26.3923 29.1159 24.6247C26.4854 22.857 23.5324 21.6248 20.4257 20.9983C17.3189 20.3718 14.1192 20.3634 11.0092 20.9736C7.89919 21.5837 4.93982 22.8004 2.30004 24.5543C-0.339736 26.3081 -2.60822 28.5647 -4.37589 31.1952Z"
                    stroke={iconColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M15.1392 34.7116L21.8998 39.2546C23.6437 40.4264 24.0629 42.8555 22.8355 44.682C21.6081 46.5085 19.2007 47.0382 17.4568 45.8664C19.2007 47.0382 19.6198 49.4673 18.3924 51.2939C17.165 53.1204 14.7576 53.6501 13.0138 52.4782L6.25316 47.9352M12.3492 42.4341L18.961 46.8772M17.903 34.1694L6.79536 50.6989L16.7922 35.8223M22.8618 37.5016L21.7511 39.1546M12.865 52.3783L11.7542 54.0312"
                    stroke={iconColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    )
}
