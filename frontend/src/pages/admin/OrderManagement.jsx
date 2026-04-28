import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingCart, Check, X, Loader2, Clock } from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/orders/${id}/status`, { status });
            fetchOrders();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Order Management</h1>
                <p>Track customer purchases and update order statuses.</p>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.User?.email}</td>
                                <td>${o.totalAmount}</td>
                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge status-${o.status}`}>
                                        {o.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {o.status === 'pending' && (
                                            <>
                                                <button 
                                                    className="icon-btn accept" 
                                                    title="Accept Order"
                                                    onClick={() => updateStatus(o.id, 'accepted')}
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                    className="icon-btn cancel" 
                                                    title="Cancel Order"
                                                    onClick={() => updateStatus(o.id, 'cancelled')}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                        {o.status === 'accepted' && (
                                            <button 
                                                className="btn-complete"
                                                onClick={() => updateStatus(o.id, 'completed')}
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
