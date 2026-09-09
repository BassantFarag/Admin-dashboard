import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'; 

const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const displayName = user?.name || user?.username || user?.email || 'Guest';

 
  const avatarUrl = user?.avatar || `${FALLBACK_AVATAR}${encodeURIComponent(displayName)}`;

  return (
    <div 
      onClick={() => navigate('/AdminProfile')}
      className="items-center hidden md:flex gap-3 px-3 py-2 rounded-2xl bg-input border border-border-custom cursor-pointer select-none hover:border-active/50 transition-colors"
    >
      {/* Avatar Image */}
      <div className="w-9 h-9 rounded-full overflow-hidden border border-active/30 flex items-center justify-center bg-bg-main shadow-sm flex-shrink-0">
        <img 
          src={avatarUrl} 
          alt={displayName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${FALLBACK_AVATAR}${encodeURIComponent(displayName)}`;
          }}
        />
      </div>

      {/* User Info */}
      <div className="flex flex-col pr-1">
        <span className="text-xs font-bold text-primary tracking-wide uppercase leading-none truncate max-w-[120px]">
          {displayName}
        </span>
        <span className="text-[11px] font-medium text-secondary leading-tight mt-1 capitalize">
          {user?.role ? user.role : 'Guest'}
        </span>
      </div>
    </div>
  );
}