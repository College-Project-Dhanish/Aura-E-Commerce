import React from 'react';

const AdminPageHeader = ({ title, description, actionButton }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
        {description && <p className="text-sm text-neutral-500 mt-1 dark:text-neutral-400">{description}</p>}
      </div>
      {actionButton && (
        <div>{actionButton}</div>
      )}
    </div>
  );
};

export default AdminPageHeader;
