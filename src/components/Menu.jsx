import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  ClipboardList, 
  ShoppingCart, 
  Settings, 
  Plus,
  Home,
  LogOut
} from 'lucide-react';

const MenuMobile = ({ onClose }) => {
    const navigate = useNavigate();
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Home},
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Products', path: '/products', icon: LayoutDashboard },
    { name: 'Add product', path: '/add-product', icon: Plus }, 
    { name: 'Orders', path: '/orders', icon: ClipboardList },
    { name: 'Cart', path: '/carts', icon: ShoppingCart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];


  //دا لغيت اما اهندل ال token
  const handleLogoutMenu = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    onClose(); 
    navigate('/login');
  };
 
  return (
    <div className="fixed inset-0 z-50 md:hidden flex">

      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative z-10 w-64 min-h-screen bg-card border-r border-border-custom flex flex-col p-6 shadow-2xl transition-colors duration-200">
        <nav className="flex-1 space-y-2 mt-4">
          {navLinks.map((link) => (
            <NavLink
              to={link.path}
              key={link.name || link.path}
              onClick={onClose} 
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive ? 'bg-active-bg text-active shadow-sm font-semibold' : 'text-secondary hover:bg-active-bg hover:text-primary'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <link.icon className="w-5 h-5 stroke-[1.8]" />
                <span>{link.name}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border-custom">
        <button 
          onClick={handleLogoutMenu}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-secondary hover:bg-danger/10 hover:text-danger transition-colors duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5 stroke-[1.8]" />
          <span>Log out</span>
        </button>
      </div> 

      </aside>
    </div>
  );
};

export default MenuMobile;