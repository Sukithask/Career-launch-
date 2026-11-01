import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme, AccentColor } from '../context/ThemeContext';

interface ThemeToggleProps {
  showAccents?: boolean;
  className?: string;
}

const ACCENT_OPTIONS: { id: AccentColor; label: string; colorHex: string }[] = [
  { id: 'indigo', label: 'Vibrant Indigo', colorHex: '#6366F1' },
  { id: 'emerald', label: 'Electric Emerald', colorHex: '#10B981' },
  { id: 'cyan', label: 'Cyber Cyan', colorHex: '#06B6D4' },
  { id: 'violet', label: 'Royal Violet', colorHex: '#8B5CF6' },
  { id: 'amber', label: 'Solar Amber', colorHex: '#F59E0B' }
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showAccents = true,
  className = ''
}) => {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Light / Dark Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-lg border border-[rgba(148,163,184,0.3)] hover:bg-[#E6D8C7]/50 text-[#171411] transition-all flex items-center justify-center relative group"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme mode"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-[#76533C] rotate-0 transition-transform duration-200" />
        )}
      </button>

      {/* Vibrant Color Theme Selector */}
      {showAccents && (
        <div className="relative" ref={paletteRef}>
          <button
            type="button"
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="p-2 rounded-lg border border-[rgba(148,163,184,0.3)] hover:bg-[#E6D8C7]/50 text-[#171411] transition-all flex items-center justify-center"
            title="Select vibrant accent theme"
            aria-label="Change color palette"
          >
            <Palette className="w-4 h-4 text-[#76533C]" />
          </button>

          {paletteOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FBF8F2] border border-[rgba(56,37,28,0.2)] rounded-xl shadow-xl p-2.5 z-50 animate-in fade-in-50 zoom-in-95">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#82786F] block px-2 pb-1.5 border-b border-[rgba(56,37,28,0.1)] mb-1.5">
                Vibrant Color Themes
              </span>
              <div className="space-y-1">
                {ACCENT_OPTIONS.map((opt) => {
                  const isSelected = accent === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setAccent(opt.id);
                        setPaletteOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#E6D8C7] text-[#171411]'
                          : 'text-[#39332E] hover:bg-[#E6D8C7]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: opt.colorHex }}
                        />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#76533C]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
