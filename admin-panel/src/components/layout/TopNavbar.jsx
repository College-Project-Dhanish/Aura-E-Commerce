import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, LogOut } from 'lucide-react';

const TopNavbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 h-16 flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-2 -ml-2 text-neutral-500 rounded-md lg:hidden hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <Menu size={24} />
        </button>
        <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          TSHIRTS Admin
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-neutral-700 hidden sm:block dark:text-neutral-300">
          {user?.first_name || user?.email || 'Admin User'}
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar;
