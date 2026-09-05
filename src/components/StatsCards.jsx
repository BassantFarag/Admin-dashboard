import React from 'react';

const StatsCards = ({ 
  total = 0, 
  featured = 0, 
  inStock = 0, 
  outOfStock = 0, 
  activeStatFilter, 
  setActiveStatFilter 
}) => {
  const stats = [
    { 
      id: 'all', 
      label: 'Total', 
      count: total, 
      icon: (
        <svg className="w-5 h-5 text-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      id: 'featured', 
      label: 'Featured', 
      count: featured, 
      icon: (
        <svg className="w-5 h-5 text-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      id: 'inStock', 
      label: 'In Stock', 
      count: inStock, 
      icon: (
        <svg className="w-5 h-5 text-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'outOfStock', 
      label: 'Out of Stock', 
      count: outOfStock, 
      icon: (
        <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const isActive = activeStatFilter === stat.id;
        
        return (
          <div
            key={stat.id}
            onClick={() => setActiveStatFilter && setActiveStatFilter(stat.id)}
            className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none ${
              isActive 
                ? 'border-active shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.02]' 
                : 'border-border-custom hover:border-active/50 hover:shadow-md'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-bg-main border border-border-custom flex items-center justify-center mb-3 transition-colors">
              {stat.icon}
            </div>
            
            <div className="text-2xl font-bold text-primary mb-0.5 tracking-tight">
              {stat.count}
            </div>
            
            <div className="text-xs font-medium text-secondary">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
