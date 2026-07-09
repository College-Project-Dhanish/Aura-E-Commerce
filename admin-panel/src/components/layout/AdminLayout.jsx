import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <TopNavbar setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="p-4 sm:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        {/* Main Content Area */}
        <Outlet />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
