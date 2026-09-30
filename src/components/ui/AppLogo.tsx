import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6', icon: 16, text: 'text-sm' },
    sm: { box: 'w-8 h-8', icon: 20, text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 24, text: 'text-lg' },
    lg: { box: 'w-12 h-12', icon: 32, text: 'text-xl' },
    xl: { box: 'w-16 h-16', icon: 44, text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Radiant Multi-Channel Logo Mark */}
      <div className={`relative ${currentSize.box} shrink-0 group`}>
        {/* Soft Ambient Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#8B1E2D] via-[#4A2810] to-[#E0A96D] opacity-60 blur-md group-hover:opacity-100 transition-opacity" />

        {/* Logo Badge Container */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#2A1417] via-[#1E0E10] to-[#14090A] border border-[#E0A96D]/25 p-1 flex items-center justify-center shadow-lg shadow-[#14090A]">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="omniGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A62639" />
                <stop offset="50%" stopColor="#8B1E2D" />
                <stop offset="100%" stopColor="#E0A96D" />
              </linearGradient>
              <linearGradient id="omniGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0A96D" />
                <stop offset="100%" stopColor="#671018" />
              </linearGradient>
            </defs>

            {/* Connecting Syndication Rays from Center to Platforms */}
            <path
              d="M24 24L12 12M24 24L36 12M24 24L38 24M24 24L34 36M24 24L14 36M24 24L10 24"
              stroke="url(#omniGrad1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />

            {/* Outer Platform Node Satellites */}
            <circle cx="12" cy="12" r="3.5" fill="#A62639" />
            <circle cx="36" cy="12" r="3.5" fill="#E0A96D" />
            <circle cx="38" cy="24" r="3" fill="#D4A373" />
            <circle cx="34" cy="36" r="3.5" fill="#C57B57" />
            <circle cx="14" cy="36" r="3.5" fill="#8B1E2D" />
            <circle cx="10" cy="24" r="3" fill="#F4A261" />

            {/* Central Omni Core Beacon (The Single Source Idea) */}
            <circle cx="24" cy="24" r="7" fill="url(#omniGrad1)" />
            <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight bg-gradient-to-r from-[#FDFBF7] via-[#F5EBE0] to-[#E0A96D] bg-clip-text text-transparent ${currentSize.text}`}
            >
              OmniPost
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#8B1E2D]/35 border border-[#A62639]/40 text-[10px] font-mono font-bold text-[#F5C2C7]">
              AI
            </span>
          </div>
          <span className="text-[10px] text-[#D4A373] font-medium tracking-wide mt-0.5">
            One Idea. Every Platform.
          </span>
        </div>
      )}
    </div>
  );
};
