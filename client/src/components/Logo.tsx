interface LogoProps {
    variant?: 'icon' | 'full';
    className?: string; // applied to the SVG icon itself
}

export function Logo({ variant = 'full', className = "w-8 h-8 text-white" }: LogoProps) {
    const SvgIcon = (
        <svg
            viewBox="0 0 100 100"
            className={`shrink-0 ${className} drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]`}
            style={{ overflow: 'visible' }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="vgradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            {/* Outer Hexagon Shield */}
            <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" stroke="url(#vgradient)" strokeWidth="8" strokeLinejoin="round" />
            {/* Inner V */}
            <path d="M30 35L50 65L70 35" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    if (variant === 'icon') {
        return SvgIcon;
    }

    return (
        <div className="flex items-center gap-3">
            {SvgIcon}
            <span className="font-black text-white tracking-tight text-xl leading-none select-none">
                Veri<span className="text-indigo-400">Mind</span>
            </span>
        </div>
    );
}
