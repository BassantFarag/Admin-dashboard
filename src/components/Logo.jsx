import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none cursor-pointer group">
     
      <div className="w-11 h-11 rounded-lg bg-active-bg border border-border-custom flex items-center justify-center transition-all duration-200 group-hover:border-active">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-active"
        >
          <polygon points="12 3 2 21 22 21 12 3" />
        </svg>
      </div>

   
      <div className="flex flex-col">
        <span className="text-base font-bold leading-tight text-primary tracking-tight">
          Auren<span className="text-active">.</span>
        </span>
        <span className="text-[9px] font-semibold tracking-[0.14em] text-secondary uppercase mt-1 mb-0.5">
          E-Commerce Admin Panel
        </span>
      </div>
    </div>
  );
}

