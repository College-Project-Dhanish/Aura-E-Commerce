import React, { useState, useEffect } from 'react';
import { ordersService } from '../services/orders';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersService.getMyOrders();
        // Backend returns { orders: [...] }
        setOrders(data.orders || data.results || data || []);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container" style={{ padding: '2rem 16px' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
      <ErrorAlert message={error} />
      
      {orders.length === 0 && !error ? (
        <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {orders.map(order => (
            <Card key={order.id || order.order_number}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem 0' }}>Order #{order.order_number || order.id}</h2>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>${parseFloat(order.total || 0).toFixed(2)}</p>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', 
                    fontWeight: 500,
                    backgroundColor: order.status === 'completed' ? '#dcfce7' : '#fef9c3',
                    color: order.status === 'completed' ? '#166534' : '#854d0e',
                    textTransform: 'capitalize'
                  }}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
