import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Package, Plus, Edit2, Trash2, X, Loader2, List, Tag } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });
    const [newCategoryName, setNewCategoryName] = useState('');

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

    // PRODUCT ACTIONS
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

    // CATEGORY ACTIONS
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/categories', { name: newCategoryName });
            setNewCategoryName('');
            fetchInitialData();
        } catch (err) { alert('Failed to create category'); }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category? (Products in this category may become uncategorized)')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            fetchInitialData();
        } catch (err) { alert('Delete failed'); }
    };

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
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.name}</strong></td>
                                <td>${p.price}</td>
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
                                <label>Product Name</label>
                                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Price ($)</label>
                                    <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Stock</label>
                                    <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows="3" />
                            </div>
                            <button type="submit" className="submit-btn">
                                {editingProduct ? 'Save Changes' : 'Create Product'}
                            </button>
                        </form>
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
                        <form onSubmit={handleCategorySubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                placeholder="e.g. Electronics" 
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}
                                required 
                            />
                            <button type="submit" className="add-btn" style={{ width: 'auto' }}><Plus size={18} /></button>
                        </form>
                        <div className="category-list">
                            {categories.map(c => (
                                <div key={c.id} className="category-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
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
