import React from 'react';

const AdminPageHeader = ({ title, description, actionButton, icon: Icon, action }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && <div className="p-2 bg-neutral-100 rounded-md"><Icon size={24} className="text-neutral-700" /></div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
        </div>
      </div>
      {(actionButton || action) && (
        <div>
          {actionButton ? actionButton : (
            <button 
              onClick={action.onClick}
              className="px-4 py-2 bg-neutral-900 text-white hover:bg-black font-medium text-sm transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;
