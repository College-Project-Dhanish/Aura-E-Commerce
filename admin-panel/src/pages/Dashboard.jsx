import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Overview of your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Placeholder Stats Cards */}
        {[
          { title: 'Total Revenue', value: '$12,345' },
          { title: 'Orders', value: '156' },
          { title: 'Products', value: '42' },
          { title: 'Customers', value: '89' },
        ].map((stat, idx) => (
          <div key={idx} className="border border-neutral-200 bg-white p-4">
            <h3 className="text-sm font-medium text-neutral-500">{stat.title}</h3>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
