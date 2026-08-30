import React from 'react';

// ======>هعدل هنا بعد ال authcontext
export default function UserProfile({ user = { name: 'Bassant Farag', role: 'Admin' } }) {
 

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="items-center hidden md:flex  gap-3 px-3 py-2 rounded-2xl bg-input border border-border-custom cursor-pointer select-none hover:border-active/50 transition-colors">
      {/* Avatar  */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-active to-active-hover flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
        {getInitial(user?.name)}
      </div>

      {/* User Info  */}
      <div className="flex flex-col pr-1">
        <span className="text-xs font-bold text-primary tracking-wide uppercase leading-none truncate max-w-[120px]">
          {user.name || 'User Name'}
        </span>
        <span className="text-[11px] font-medium text-secondary leading-tight mt-0.5 capitalize">
          {user.role || 'Customer'}
        </span>
      </div>
    </div>
  );
}