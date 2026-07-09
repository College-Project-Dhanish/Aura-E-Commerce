import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const SidebarGroup = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-neutral-500" />}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
      </button>
      {isOpen && (
        <div className="mt-1 flex flex-col pl-6">
          {children}
        </div>
      )}
    </div>
  );
};

export const SidebarItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-1.5 text-sm transition-colors ${
          isActive
            ? 'bg-neutral-100 text-neutral-900 font-medium dark:bg-neutral-800 dark:text-neutral-50'
            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50'
        }`
      }
    >
      {label}
    </NavLink>
  );
};
