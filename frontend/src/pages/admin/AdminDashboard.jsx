import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, ShoppingBag, DollarSign, Package, Loader2, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (err) {
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="admin-loading">
            <Loader2 className="animate-spin" size={48} color="#6366f1" />
            <p>Loading System Summary...</p>
        </div>
    );

    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1>System Overview</h1>
                    <p>Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="admin-badge">
                    <TrendingUp size={16} /> Live Data
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users"><Users /></div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="value">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue"><DollarSign /></div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="value">LKR {stats.totalRevenue}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orders"><ShoppingBag /></div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="value">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon products"><Package /></div>
                    <div className="stat-info">
                        <h3>Products</h3>
                        <p className="value">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
