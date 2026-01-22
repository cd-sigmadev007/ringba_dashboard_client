import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const AuthBgChat: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const iconColor = isDark ? '#5E8FC7' : '#7E8299'
    const iconOpacity = isDark ? '0.3' : '0.2'

    return (
        <svg
            width="53"
            height="83"
            viewBox="0 0 53 83"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <g opacity={iconOpacity}>
                <path
                    d="M21.4539 29.0692C24.4774 24.2027 29.1732 20.607 34.6597 18.9573C40.1464 17.3076 46.0467 17.7173 51.2527 20.1094C56.4587 22.5016 60.6125 26.712 62.9343 31.9497C65.2562 37.1875 65.5866 43.0933 63.8631 48.5573C62.1395 54.0211 58.4803 58.668 53.5735 61.6256C48.6666 64.583 42.8485 65.6476 37.2122 64.6198L37.0012 64.5813L36.8283 64.7078L29.848 69.8035L29.8438 69.8061C29.6309 69.9643 29.3796 70.0627 29.1159 70.0903C28.8523 70.1178 28.5861 70.0739 28.3451 69.9633C28.1041 69.8526 27.8964 69.6788 27.7455 69.4606C27.5948 69.2425 27.5056 68.9877 27.4871 68.7232L27.4866 68.7192L26.8065 60.1027L26.7899 59.8891L26.6232 59.754C22.1721 56.1467 19.1905 51.0386 18.2387 45.3889C17.2869 39.7392 18.4305 33.9358 21.4539 29.0692Z"
                    stroke={iconColor}
                />
                <circle cx="42.4009" cy="44.6967" r="2.5" fill={iconColor} />
                <circle cx="31.0591" cy="48.8969" r="2.5" fill={iconColor} />
                <circle cx="53.7437" cy="40.4965" r="2.5" fill={iconColor} />
            </g>
        </svg>
    )
}
