interface LogoProps {
    variant?: 'icon' | 'full';
    className?: string; // applied to the SVG icon itself
}

export function Logo({ variant = 'full', className = "w-8 h-8" }: LogoProps) {
    const GradientId = "verimind-logo-gradient";

    const SvgIcon = (
        <svg
            viewBox="0 0 100 100"
            className={`shrink-0 ${className} drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]`}
            style={{ overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={GradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" /> {/* Indigo-500 */}
                    <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
                </linearGradient>
            </defs>
            {/* Outer Hexagon Shield */}
            <path
                d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
                stroke={`url(#${GradientId})`}
                strokeWidth="8"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.1"
                className="text-indigo-500/20"
            />
            {/* Inner V */}
            <path
                d="M30 35L50 65L70 35"
                stroke={`url(#${GradientId})`}
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );

    if (variant === 'icon') {
        return SvgIcon;
    }

    return (
        <div className="flex items-center gap-3 select-none group/logo">
            {SvgIcon}
            <span className="font-black tracking-tighter text-2xl leading-none flex items-center">
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-600 group-hover/logo:from-indigo-400 group-hover/logo:to-purple-500 transition-all duration-300">
                    VeriMind
                </span>
            </span>
        </div>
    );
}
