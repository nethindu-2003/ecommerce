import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingBag, Plus, Filter, Loader2, CheckCircle, XCircle, Clock, Search, ShoppingCart, Minus, Eye, Package, X } from 'lucide-react';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    
    // New Order Modal States
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]); // [{productId, name, price, quantity}]
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [orderRes, prodRes, catRes] = await Promise.all([
                api.get('/user/orders'),
                api.get('/user/products'),
                api.get('/user/categories')
            ]);
            setOrders(orderRes.data);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return alert('Your cart is empty');
        try {
            const items = cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            await api.post('/user/orders', { items });
            setShowOrderModal(false);
            setCart([]);
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Order failed'); }
    };

    const addToCart = (product) => {
        const existing = cart.find(i => i.productId === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) {
                alert('Maximum stock reached');
                return;
            }
            setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        const existing = cart.find(i => i.productId === productId);
        if (existing.quantity > 1) {
            setCart(cart.map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            setCart(cart.filter(i => i.productId !== productId));
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.categoryId === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const totalCartAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No orders found matching this status.</td></tr>
                        ) : filteredOrders.map(o => (
                            <tr key={o.id} onClick={() => setSelectedOrder(o)} className="clickable-row">
                                <td>#{o.id}</td>
                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td>LKR {o.totalAmount}</td>
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

            {/* NEW ORDER MODAL */}
            {showOrderModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '900px', display: 'flex', gap: '20px', padding: '24px' }}>
                        {/* Product Selection Side */}
                        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
                            <div className="modal-header">
                                <h2>Shop Products</h2>
                                <button onClick={() => setShowOrderModal(false)}><XCircle /></button>
                            </div>

                            <div className="search-filter-box" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ padding: '10px 10px 10px 40px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="product-list-scroll" style={{ flex: 1, overflowY: 'auto', maxHeight: '500px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {filteredProducts.map(p => (
                                        <div key={p.id} className="product-selection-card" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                            <div style={{ fontWeight: '600', fontSize: '15px' }}>{p.name}</div>
                                            <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: '700', margin: '4px 0' }}>LKR {p.price}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Stock: {p.stock} units</div>
                                            <button 
                                                className="add-to-cart-btn"
                                                onClick={() => addToCart(p)}
                                                disabled={p.stock === 0}
                                                style={{ marginTop: '10px', width: '100%', padding: '6px', fontSize: '13px', background: p.stock === 0 ? '#cbd5e1' : '#6366f1' }}
                                            >
                                                <Plus size={14} /> Add to Cart
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cart Side */}
                        <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                            <h3><ShoppingCart size={20} /> My Cart</h3>
                            <div className="cart-items" style={{ flex: 1, overflowY: 'auto', margin: '20px 0' }}>
                                {cart.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>Cart is empty</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>LKR {item.price} x {item.quantity}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button className="icon-btn" onClick={() => removeFromCart(item.productId)}><Minus size={14} /></button>
                                                <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button 
                                                    className="icon-btn" 
                                                    onClick={() => {
                                                        const prod = products.find(p => p.id === item.productId);
                                                        if (item.quantity >= prod.stock) {
                                                            alert(`Only ${prod.stock} units available in stock.`);
                                                            return;
                                                        }
                                                        addToCart(prod);
                                                    }}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="cart-footer" style={{ borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: '700', fontSize: '18px' }}>
                                    <span>Total:</span>
                                    <span>LKR {totalCartAmount.toFixed(2)}</span>
                                </div>
                                <button className="submit-btn" onClick={handlePlaceOrder} disabled={cart.length === 0}>
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ORDER DETAILS MODAL */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Order Details #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)}><X /></button>
                        </div>
                        
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Status</span>
                                <span className={`status-badge status-${selectedOrder.status}`}>{selectedOrder.status.toUpperCase()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Date Placed</span>
                                <span style={{ fontWeight: '600' }}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Total Amount</span>
                                <span style={{ fontWeight: '700', color: '#6366f1', fontSize: '18px' }}>LKR {selectedOrder.totalAmount}</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '15px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={18} /> Items Purchased
                        </h3>
                        <div className="order-items-list" style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
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

                        <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="secondary-btn" onClick={() => setSelectedOrder(null)} style={{ padding: '10px 24px' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
