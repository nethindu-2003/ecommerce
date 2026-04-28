import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingBag, Clock, CheckCircle, Package, Loader2 } from 'lucide-react';

const UserDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/user/orders');
                const orders = res.data;
                setStats({
                    total: orders.length,
                    pending: orders.filter(o => o.status === 'pending').length,
                    completed: orders.filter(o => o.status === 'completed').length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Welcome Back</h1>
                <p>Here's a summary of your recent shopping activity.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon orders"><ShoppingBag /></div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="value">{stats.total}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f59e0b' }}><Clock /></div>
                    <div className="stat-info">
                        <h3>Pending Orders</h3>
                        <p className="value">{stats.pending}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#10b981' }}><CheckCircle /></div>
                    <div className="stat-info">
                        <h3>Completed</h3>
                        <p className="value">{stats.completed}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-cta" style={{ marginTop: '40px', padding: '40px', background: 'white', borderRadius: '16px', textAlign: 'center' }}>
                <Package size={48} color="#6366f1" style={{ marginBottom: '16px' }} />
                <h2>Ready for more?</h2>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Browse our latest products and place a new order today.</p>
                <button onClick={() => window.location.href = '/orders'} style={{ width: 'auto', padding: '12px 32px' }}>
                    Shop Now
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
