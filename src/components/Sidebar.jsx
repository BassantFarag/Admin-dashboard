import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut ,
  Plus,
  Home
} from 'lucide-react';


 const Sidebar = ()=>{
// Links  
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
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');

    navigate('/login');
  }; 

  return (
    <aside className=" hidden w-64 min-h-screen bg-card border-r border-border-custom  flex-col p-6 transition-colors duration-200 md:flex ">
      
      {/* Logo */}
      <div className="mb-10 px-2 flex flex-col select-none cursor-pointer">
      
       <span className="text-[10px] font-bold tracking-[0.22em] text-active uppercase leading-none mb-1.5">
          COMMERCE
        </span>

      
      <h1 className="text-xl font-extrabold text-primary tracking-tight leading-none">
        Auren Panel
      </h1>
      </div>

     {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          
          return (
            <NavLink
              to={link.path}
             key={link.name || link.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive ? 'bg-active-bg text-active shadow-sm font-semibold': 'text-secondary hover:bg-active-bg hover:text-primary'
                }`
              }
            >

              <div className="flex items-center gap-3.5">
                <link.icon className="w-5 h-5 stroke-[1.8]" />
                <span>{link.name}</span>
              </div>

            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-border-custom">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-secondary hover:bg-danger/10 hover:text-danger transition-colors duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5 stroke-[1.8]" />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;