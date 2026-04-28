import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingBag, Plus, Filter, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]); // [{productId, quantity}]

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [orderRes, prodRes] = await Promise.all([
                api.get('/user/orders'),
                api.get('/admin/products') // Reusing admin product list for shopping
            ]);
            setOrders(orderRes.data);
            setProducts(prodRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handlePlaceOrder = async () => {
        if (selectedItems.length === 0) return alert('Select at least one item');
        try {
            await api.post('/user/orders', { items: selectedItems });
            setShowOrderModal(false);
            setSelectedItems([]);
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Order failed'); }
    };

    const toggleItem = (productId) => {
        const exists = selectedItems.find(i => i.productId === productId);
        if (exists) {
            setSelectedItems(selectedItems.filter(i => i.productId !== productId));
        } else {
            setSelectedItems([...selectedItems, { productId, quantity: 1 }]);
        }
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>My Orders</h1>
                    <p>Track your purchases and view order history.</p>
                </div>
                <button className="add-btn" onClick={() => setShowOrderModal(true)}>
                    <Plus size={18} /> New Order
                </button>
            </div>

            <div className="filter-bar" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(s => (
                    <button 
                        key={s}
                        className={`filter-btn ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                        style={{ 
                            padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0',
                            background: filter === s ? '#6366f1' : 'white',
                            color: filter === s ? 'white' : '#64748b', cursor: 'pointer'
                        }}
                    >
                        {s.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No orders found matching this status.</td></tr>
                        ) : filteredOrders.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td>${o.totalAmount}</td>
                                <td>
                                    <span className={`status-badge status-${o.status}`}>
                                        {o.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PLACE ORDER MODAL */}
            {showOrderModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Select Products</h2>
                            <button onClick={() => setShowOrderModal(false)}><XCircle /></button>
                        </div>
                        <div className="product-selection-list" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '24px' }}>
                            {products.map(p => (
                                <div 
                                    key={p.id} 
                                    className={`selection-item ${selectedItems.find(i => i.productId === p.id) ? 'selected' : ''}`}
                                    onClick={() => toggleItem(p.id)}
                                    style={{ 
                                        padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', 
                                        marginBottom: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                                        background: selectedItems.find(i => i.productId === p.id) ? '#f0f4ff' : 'white'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{p.name}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b' }}>${p.price}</div>
                                    </div>
                                    {selectedItems.find(i => i.productId === p.id) && <CheckCircle size={20} color="#6366f1" />}
                                </div>
                            ))}
                        </div>
                        <button className="submit-btn" onClick={handlePlaceOrder}>
                            Confirm Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
