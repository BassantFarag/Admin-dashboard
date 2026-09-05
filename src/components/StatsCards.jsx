import React from 'react';

const StatsCards = ({ total, featured, inStock, outOfStock, activeStatFilter, setActiveStatFilter }) => {
  const stats = [
    { 
      id: 'all', 
      label: 'Total', 
      count: total, 
      iconSrc: '../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png',
      iconAlt: 'Total'
    },
    { 
      id: 'featured', 
      label: 'Featured', 
      count: featured, 
      iconSrc: '../../icons/star_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png',
      iconAlt: 'Featured'
    },
    { 
      id: 'inStock', 
      label: 'In Stock', 
      count: inStock, 
      iconSrc: '../../icons/chart_data_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png',
      iconAlt: 'In Stock'
    },
    { 
      id: 'outOfStock', 
      label: 'Out of Stock', 
      count: outOfStock, 
      iconSrc: '../../icons/settings_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png',
      iconAlt: 'Out of Stock'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => setActiveStatFilter(stat.id)}
          className={`bg-[#141414] border ${
            activeStatFilter === stat.id ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-[#2a2a2a]'
          } rounded-2xl p-4 cursor-pointer transition-all hover:border-[#d4af37] hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]`}
        >
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-sm mb-3">
            <img 
              src={stat.iconSrc} 
              alt={stat.iconAlt} 
              className="w-5 h-5 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
          <div className="text-xs text-[#a3a3a3]">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;