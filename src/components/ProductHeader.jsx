import React from 'react';
import { ArrowLeft, Box } from 'lucide-react';

export default function ProductHeader({ isActive, handleBack, isDark }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 mb-8 shadow-sm transition-all duration-300 ${
      isDark 
        ? 'bg-[#0d0e10] border border-[#2a2b2e]' 
        : 'bg-[#faf9f5] border border-[#e3b158]/20'
    }`}>
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 mb-6 cursor-pointer group border ${
          isDark
            ? 'text-[#c9c8c3] bg-[#161719] hover:bg-[#1a1b1d] hover:text-[#e3b158] border-[#2a2b2e] hover:border-[#d9a441]'
            : 'text-[#3a3b3e] bg-[#f2f2f0] hover:bg-[#e3b158]/10 hover:text-[#d9a441] border-[#2a2b2e]/10 hover:border-[#d9a441]/40'
        }`}
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to products</span>
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section Info */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#332813] border-[#d9a441]/30 text-[#e3b158]'
                : 'bg-[#e3b158]/10 border-[#e3b158]/30 text-[#d9a441]'
            }`}>
              <Box size={22} />
            </div>
            <span className={`text-xs font-bold tracking-wider uppercase ${
              isDark ? 'text-[#e3b158]' : 'text-[#d9a441]'
            }`}>
              EDIT PRODUCT
            </span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight leading-tight transition-colors ${
            isDark ? 'text-[#f2f2f0]' : 'text-[#0d0e10]'
          }`}>
            Update and refine the product entry
          </h1>

          <p className={`text-sm md:text-base leading-relaxed font-medium transition-colors ${
            isDark ? 'text-[#c9c8c3]' : 'text-[#3a3b3e]'
          }`}>
            Review the current product data, add new images, remove existing ones, and save your updates safely.
          </p>
        </div>

        <div className={`w-full lg:w-72 border rounded-xl p-4 self-start lg:self-center shadow-sm transition-colors ${
          isDark ? 'bg-[#161719] border-[#2a2b2e]' : 'bg-white border-[#e3b158]/15'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              isActive ? 'bg-emerald-500 animate-pulse' : isDark ? 'bg-[#e3b158]' : 'bg-[#d9a441]'
            }`}></span>
            <span className={`text-xs font-bold tracking-wider uppercase ${
              isActive 
                ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                : isDark ? 'text-[#c9c8c3]' : 'text-[#3a3b3e]'
            }`}>
              {isActive ? 'LIVE' : 'INACTIVE'}
            </span>
          </div>
    
    
    
    
          <p className={`text-xs leading-snug transition-colors ${
            isDark ? 'text-[#c9c8c3]/80' : 'text-[#3a3b3e]/80'
          }`}>
            Connected to the real product update API.
          </p>
        </div>
      </div>
    </div>
  );
}
