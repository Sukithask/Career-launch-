import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'adaptive';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'adaptive'
}) => {
  // Dimension mappings
  const iconDimensions = {
    sm: { box: 'w-7 h-7', svg: 28 },
    md: { box: 'w-10 h-10', svg: 40 },
    lg: { box: 'w-13 h-13', svg: 52 },
    xl: { box: 'w-16 h-16', svg: 64 }
  }[size];

  const textStyles = {
    sm: { title: 'text-sm', sub: 'text-[9px]' },
    md: { title: 'text-base font-extrabold', sub: 'text-[10px]' },
    lg: { title: 'text-xl font-extrabold', sub: 'text-xs' },
    xl: { title: 'text-2xl font-black', sub: 'text-xs' }
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Geometric Brandmark: Upward Launch Rocket & Academic Cap synthesis */}
      <div
        className={`${iconDimensions.box} relative shrink-0 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#06B6D4] border border-white/20`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Subtle geometric grid line */}
          <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="0.75" strokeDasharray="2 2" strokeOpacity="0.4" />
          
          {/* Outer launch chevron / compass needle */}
          <path
            d="M24 6L38 20L31 22L24 14L17 22L10 20L24 6Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />

          {/* Academic Mortarboard Diamond Base */}
          <path
            d="M24 16L40 25L24 34L8 25L24 16Z"
            fill="#1E1B4B"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Upward Ascending Core Vector (Placement Trajectory) */}
          <path
            d="M24 10L32 23H26V38H22V23H16L24 10Z"
            fill="#38BDF8"
          />

          {/* Tassel / Star Accents */}
          <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
          <path
            d="M38 25V33C38 34.5 35 37 24 37C13 37 10 34.5 10 33V25"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />

          {/* Base Foundation Pillar */}
          <rect x="20" y="39" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.7" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight text-[#171411] font-sans ${textStyles.title}`}
          >
            Career<span className="text-[#4F46E5] dark:text-[#818CF8]">Launch</span>
          </span>
          <span
            className={`font-mono uppercase tracking-widest text-[#82786F] mt-1 font-semibold ${textStyles.sub}`}
          >
            Placement Engine
          </span>
        </div>
      )}
    </div>
  );
};

// Watermark Component for Canvas & Documents
export const AppWatermark: React.FC<{
  label?: string;
  variant?: 'subtle-corner' | 'diagonal-tile' | 'document';
  className?: string;
}> = ({
  label = 'CAREERLAUNCH · CAMPUS PLACEMENT EDITION',
  variant = 'subtle-corner',
  className = ''
}) => {
  if (variant === 'diagonal-tile') {
    return (
      <div
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-[0.035] dark:opacity-[0.04] ${className}`}
        aria-hidden="true"
      >
        <div className="absolute -inset-10 flex flex-wrap gap-20 rotate-[-22deg] justify-center items-center">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="text-2xl font-black font-mono tracking-widest text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap"
            >
              CAREERLAUNCH · LOCAL PROTOTYPE
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'document') {
    return (
      <div
        className={`pointer-events-none select-none flex items-center justify-between text-[9px] font-mono tracking-wider text-[#64748B] dark:text-[#94A3B8] border-t border-[rgba(148,163,184,0.3)] pt-2 mt-4 ${className}`}
        aria-hidden="true"
      >
        <span>OFFICIAL PLACEMENT DOSSIER · CAREERLAUNCH</span>
        <span>VERIFIED CAMPUS PREP ARCHITECTURE</span>
      </div>
    );
  }

  // Subtle bottom-right corner stamp
  return (
    <div
      className={`pointer-events-none fixed bottom-3 right-4 z-10 hidden sm:flex items-center gap-2 select-none opacity-50 hover:opacity-90 transition-opacity no-print ${className}`}
      aria-hidden="true"
    >
      <div className="w-2 h-2 rounded-full bg-[#4F46E5] dark:bg-[#818CF8] animate-pulse" />
      <span className="text-[10px] font-mono tracking-widest text-[#0F172A] dark:text-[#F8FAFC] font-semibold uppercase">
        {label}
      </span>
    </div>
  );
};
