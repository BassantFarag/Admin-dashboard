import React, { useState, useEffect } from 'react';
import { ArrowLeft, Box } from 'lucide-react';

export default function ProductHeader({ isActive, handleBack, isDark }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 md:p-7 mb-6 shadow-2xl transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${
        isDark
          ? 'bg-[#0b0c0e] border border-[#2a2b2e]/60 text-[#f2f2f0]'
          : 'bg-[#faf9f5] border border-[#e3b158]/20 text-[#0d0e10]'
      }`}
    >
      <div 
        className={`absolute -top-24 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isDark 
            ? 'bg-gradient-to-bl from-[#e3b158]/20 via-[#d9a441]/10 to-transparent opacity-70' 
            : 'bg-gradient-to-bl from-[#e3b158]/25 via-[#e3b158]/5 to-transparent opacity-80'
        }`}
      />

      <div 
        className={`absolute top-0 right-0 w-full h-full pointer-events-none opacity-30 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#e3b158]/30 via-transparent to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d9a441]/20 via-transparent to-transparent'
        }`}
      />

      {/* Content Container */}
      <div className="relative z-10 space-y-4">
        
        {/* Top Bar: Back Button & Status Badge */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-full transition-all duration-300 cursor-pointer group border ${
              isDark
                ? 'text-[#c9c8c3] bg-[#161719]/80 hover:bg-[#1a1b1d] hover:text-[#e3b158] border-[#2a2b2e] hover:border-[#d9a441]/50'
                : 'text-[#3a3b3e] bg-[#f2f2f0]/80 hover:bg-[#e3b158]/10 hover:text-[#d9a441] border-[#2a2b2e]/10 hover:border-[#d9a441]/40'
            }`}
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to products</span>
          </button>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md transition-colors ${
              isDark 
                ? 'bg-[#161719]/60 border-[#2a2b2e]' 
                : 'bg-white/80 border-[#e3b158]/20'
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isActive ? 'bg-emerald-500 animate-pulse' : isDark ? 'bg-[#e3b158]' : 'bg-[#d9a441]'
              }`}
            />
            <span
              className={`text-[10px] font-bold tracking-widest uppercase ${
                isActive
                  ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                  : isDark ? 'text-[#c9c8c3]' : 'text-[#3a3b3e]'
              }`}
            >
              {isActive ? 'LIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>

        {/* Main Title & Description */}
        <div className="space-y-2 max-w-2xl pt-1">
          {/* Tag Category */}
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md border transition-colors ${
                isDark
                  ? 'bg-[#332813]/60 border-[#d9a441]/30 text-[#e3b158]'
                  : 'bg-[#e3b158]/15 border-[#e3b158]/30 text-[#d9a441]'
              }`}
            >
              <Box size={15} />
            </div>
            <span
              className={`text-[11px] font-bold tracking-widest uppercase ${
                isDark ? 'text-[#e3b158]' : 'text-[#d9a441]'
              }`}
            >
              Edit Product
            </span>
          </div>

          {/* Header Title */}
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight transition-colors ${
              isDark ? 'text-[#f2f2f0]' : 'text-[#0d0e10]'
            }`}
          >
            Update and refine the product entry
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xs md:text-sm leading-relaxed font-normal max-w-xl transition-colors ${
              isDark ? 'text-[#c9c8c3]/80' : 'text-[#3a3b3e]/80'
            }`}
          >
            Review current product data, manage media galleries, and sync changes directly with your inventory.
          </p>
        </div>

      </div>
    </div>
  );
}