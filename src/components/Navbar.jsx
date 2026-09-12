import { useEffect, useState } from 'react';
import { Sun, Moon, Heart, Menu, X } from 'lucide-react';
import Logo from './Logo';
import UserProfile from './UserProfile';
import MenuMobile from './Menu';
import { useNavigate } from 'react-router-dom';
import {getWishlistStats} from '../api/wishlistApi';
import { toast } from 'react-toastify';


export default function Navbar({ isDark, setIsDark }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate()
  const [wishlistCount, setWishlistCount] = useState(0);

  //to put the number of wishlist
  useEffect(()=>{
    const fetchWishlistStats =async()=>{
      try{
        const response = await getWishlistStats();
        setWishlistCount(response.data.statistics.totalWishlists || 0);
      }catch(error){
        toast.error('Failed to load wishlist count',{
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
         draggable: true,
         style: {
          backgroundColor: 'var(--color-card-bg, #1e293b)',
          color: 'var(--color-text-primary, #f8fafc)',
          border: '1px solid #f43f5e',  
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(244, 63, 94, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
        },
        progressStyle: {
          background: '#f43f5e',
        },
        })
      }
    }
    fetchWishlistStats();
  },[])
  
  return (
    <>
      <header className="p-3 sm:p-4 px-4 sm:px-8 bg-card border-b border-border-custom flex justify-between items-center transition-colors duration-200">
      
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-bg-main border border-border-custom text-secondary hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Logo />
        </div>

        
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-bg-main border border-border-custom text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => navigate('Wishlist')}
            className="p-2 rounded-xl bg-bg-main border border-border-custom text-secondary hover:text-primary transition-colors relative cursor-pointer group"
            title="View Wishlists Analytics"
          >
            <Heart className="w-5 h-5 group-hover:text-rose-500 transition-colors" />
            
            
            {wishlistCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 border-2 border-card">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </button>

          <UserProfile />
        </div>
      </header>

    
     {isOpen && (
        <MenuMobile onClose={() => setIsOpen(false)} />
     )}
    </>
  );
}