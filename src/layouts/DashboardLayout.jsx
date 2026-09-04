import React from 'react';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';




const DashboardLayout = () => {

    
    const [isDark, setIsDark] = useState(() => {
        return localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark'; 
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light'; 
    }
  }, [isDark]);


  return (
    <div className="flex min-h-screen bg-bg-main text-primary transition-colors duration-200">
        <Sidebar />

        <div className="flex-1 flex flex-col">
        
        <Navbar isDark={isDark} setIsDark={setIsDark} />

      
        <main className="p-8 flex-1">
          <Outlet context={{ isDark, setIsDark }} />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout