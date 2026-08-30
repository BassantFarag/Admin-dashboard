import { useState } from 'react';
import { Sun, Moon, Bell, Menu, X } from 'lucide-react';
import Logo from './Logo';
import UserProfile from './UserProfile';
import MenuMobile from './Menu';

export default function Navbar({ isDark, setIsDark }) {
  
  const [isOpen, setIsOpen] = useState(false);

  
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

          <button className="p-2 rounded-xl bg-bg-main border border-border-custom text-secondary hover:text-primary transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-active absolute top-2 right-2"></span>
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