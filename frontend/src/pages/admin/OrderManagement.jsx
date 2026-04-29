import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingCart, Check, X, Loader2, Clock, User, Package, Eye, Search, Filter } from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
            setSelectedOrder(null);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status');
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = 
            o.id.toString().includes(searchQuery) || 
            o.User?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.User?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Order Management</h1>
            </div>
            <p>Track customer purchases and update order statuses.</p>

            {/* FILTERS & SEARCH */}
            <div className="admin-filter-bar" style={{ display: 'flex', gap: '15px', marginTop: '24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Customer..." 
                        className="admin-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '12px 12px 12px 40px', width: '100%', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Filter size={18} color="#64748b" />
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', minWidth: '150px' }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
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
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders found matching your search.</td></tr>
                        ) : filteredOrders.map(o => (
                            <tr key={o.id} onClick={() => setSelectedOrder(o)} className="clickable-row">
                                <td>#{o.id}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{o.User?.name || o.User?.email}</span>
                                        <span style={{ fontSize: '10px', color: o.User?.role === 'admin' ? '#ef4444' : '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                                            {o.User?.role}
                                        </span>
                                    </div>
                                </td>
                                <td>LKR {o.totalAmount}</td>
                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge status-${o.status}`}>
                                        {o.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}>
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ORDER DETAILS MODAL */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h2>Order Details #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)}><X /></button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
                            <div className="detail-section">
                                <h3 style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}><User size={16} /> Customer Info</h3>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                    <div style={{ fontWeight: '600' }}>{selectedOrder.User?.name}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>{selectedOrder.User?.email}</div>
                                    <div style={{ fontSize: '12px', marginTop: '5px', textTransform: 'capitalize' }}>Gender: {selectedOrder.User?.gender}</div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h3 style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}><Clock size={16} /> Order Info</h3>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                    <div style={{ fontWeight: '600' }}>Status: <span className={`status-${selectedOrder.status}`}>{selectedOrder.status.toUpperCase()}</span></div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                                    <div style={{ fontSize: '15px', marginTop: '5px', fontWeight: '700', color: '#6366f1' }}>Total: LKR {selectedOrder.totalAmount}</div>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}><Package size={16} /> Purchased Items</h3>
                        <div className="order-items-list" style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', marginBottom: '30px' }}>
                            {selectedOrder.OrderItems?.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{item.Product?.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Price per unit: LKR {item.price}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '700' }}>x {item.quantity}</div>
                                        <div style={{ fontSize: '13px', color: '#6366f1' }}>LKR {(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            {selectedOrder.status === 'pending' && (
                                <>
                                    <button className="secondary-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => updateStatus(selectedOrder.id, 'cancelled')}>
                                        Cancel Order
                                    </button>
                                    <button className="add-btn" onClick={() => updateStatus(selectedOrder.id, 'accepted')}>
                                        Accept & Reduce Stock
                                    </button>
                                </>
                            )}
                            {selectedOrder.status === 'accepted' && (
                                <button className="add-btn" onClick={() => updateStatus(selectedOrder.id, 'completed')}>
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
