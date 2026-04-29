import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Package, Plus, Edit2, Trash2, X, Loader2, List, Tag, History, User, Clock, Search, Filter } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });
    const [newCategoryName, setNewCategoryName] = useState('');
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // History Modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productHistory, setProductHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/admin/products'),
                api.get('/admin/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.patch(`/admin/products/${editingProduct.id}`, productForm);
            } else {
                await api.post('/admin/products', productForm);
            }
            setShowProductModal(false);
            fetchInitialData();
        } catch (err) { alert('Failed to save product'); }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchInitialData();
        } catch (err) { alert('Delete failed'); }
    };

    const fetchProductHistory = async (product) => {
        setSelectedProduct(product);
        setShowHistoryModal(true);
        setHistoryLoading(true);
        try {
            const res = await api.get(`/admin/products/${product.id}/orders`);
            setProductHistory(res.data);
        } catch (err) { console.error(err); }
        finally { setHistoryLoading(false); }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/categories', { name: newCategoryName });
            setNewCategoryName('');
            fetchInitialData();
        } catch (err) { alert('Failed to create category'); }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            fetchInitialData();
        } catch (err) { alert('Delete failed'); }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.categoryId === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Inventory Management</h1>
                    <p>Manage your products and their categories in one place.</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                    <button className="secondary-btn" onClick={() => setShowCategoryModal(true)}>
                        <List size={18} /> Categories
                    </button>
                    <button className="add-btn" onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '' }); setShowProductModal(true); }}>
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="admin-filter-bar" style={{ display: 'flex', gap: '15px', marginTop: '24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search products by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '12px 12px 12px 40px', width: '100%', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Filter size={18} color="#64748b" />
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', minWidth: '180px' }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No products found matching your filters.</td></tr>
                        ) : filteredProducts.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.name}</strong></td>
                                <td>LKR {p.price}</td>
                                <td>
                                    <span className={p.stock < 10 ? 'low-stock' : ''}>{p.stock} units</span>
                                </td>
                                <td>
                                    <span className="category-tag">
                                        <Tag size={12} /> {p.Category?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn" title="View Sales History" onClick={() => fetchProductHistory(p)}>
                                            <History size={18} />
                                        </button>
                                        <button className="icon-btn edit" onClick={() => {
                                            setEditingProduct(p);
                                            setProductForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, categoryId: p.categoryId });
                                            setShowProductModal(true);
                                        }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => deleteProduct(p.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PRODUCT MODAL */}
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowProductModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="admin-form">
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag size={16} /> Product Name
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Premium Wireless Headphones"
                                    value={productForm.name} 
                                    onChange={e => setProductForm({ ...productForm, name: e.target.value })} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <List size={16} /> Category
                                </label>
                                <select 
                                    value={productForm.categoryId} 
                                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })} 
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>LKR Price</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="0.00"
                                        value={productForm.price} 
                                        onChange={e => setProductForm({ ...productForm, price: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Stock Level</label>
                                    <input 
                                        type="number" 
                                        placeholder="Quantity"
                                        value={productForm.stock} 
                                        onChange={e => setProductForm({ ...productForm, stock: e.target.value })} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Edit2 size={16} /> Description
                                </label>
                                <textarea 
                                    placeholder="Describe your product features..."
                                    value={productForm.description} 
                                    onChange={e => setProductForm({ ...productForm, description: e.target.value })} 
                                    rows="4" 
                                />
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
                                <button type="button" className="secondary-btn" style={{ flex: 1 }} onClick={() => setShowProductModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="add-btn" style={{ flex: 2 }}>
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SALES HISTORY MODAL */}
            {showHistoryModal && (
                <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Sales History: {selectedProduct?.name}</h2>
                            <button onClick={() => setShowHistoryModal(false)}><X /></button>
                        </div>
                        {historyLoading ? <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div> : (
                            <div className="history-list">
                                {productHistory.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No sales yet for this product.</p> : (
                                    productHistory.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontWeight: '600' }}><User size={14} /> {item.Order?.User?.name || item.Order?.User?.email}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}><Clock size={12} /> {new Date(item.Order?.createdAt).toLocaleString()}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: '700', color: '#6366f1' }}>x {item.quantity} units</div>
                                                <div className={`status-badge status-${item.Order?.status}`} style={{ fontSize: '10px' }}>{item.Order?.status.toUpperCase()}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CATEGORY MANAGEMENT MODAL */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>Manage Categories</h2>
                            <button onClick={() => setShowCategoryModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="admin-form">
                            <div className="form-group">
                                <label>Category Name</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="e.g. Electronics"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="add-btn" style={{ width: 'auto' }}><Plus size={18} /></button>
                                </div>
                            </div>
                        </form>
                        <div className="category-list">
                            {categories.map(c => (
                                <div key={c.id} className="category-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                                    <span>{c.name}</span>
                                    <button onClick={() => deleteCategory(c.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
