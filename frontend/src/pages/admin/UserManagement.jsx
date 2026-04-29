import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User, Mail, Calendar, Power, PowerOff, ShoppingBag, X, Loader2, Search, FileText } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await api.patch(`/admin/users/${id}/toggle`);
            setUsers(users.map(u => u.id === id ? { ...u, isActive: res.data.isActive } : u));
        } catch (err) {
            alert('Failed to update status');
            fetchUsers();
        }
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setOrdersLoading(true);
        try {
            const res = await api.get(`/admin/users/${user.id}/orders`);
            setUserOrders(res.data);
        } catch (err) { console.error(err); }
        finally { setOrdersLoading(false); }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>User Management</h1>
            </div>
            <p>Manage customer accounts and monitor their activities.</p>

            {/* SEARCH BAR */}
            <div className="admin-filter-bar" style={{ marginTop: '24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '12px 12px 12px 40px', width: '100%', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No users found matching your search.</td></tr>
                        ) : filteredUsers.map(u => (
                            <tr key={u.id} onClick={() => handleUserClick(u)} className="clickable-row">
                                <td><strong>{u.name || 'N/A'}</strong></td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                                        {u.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className={`icon-btn ${u.isActive ? 'deactivate' : 'activate'}`}
                                        onClick={(e) => { e.stopPropagation(); toggleStatus(u.id); }}
                                    >
                                        {u.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                                    <User size={24} color="#6366f1" />
                                </div>
                                <div>
                                    <h2 style={{ marginBottom: '2px' }}>{selectedUser.name}</h2>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Customer Profile</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)}><X /></button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Email Address</label>
                                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={14} /> {selectedUser.email}
                                </div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Date of Birth</label>
                                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={14} /> {selectedUser.birthday || 'Not set'}
                                </div>
                            </div>
                        </div>

                        <div className="modal-section">
                            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FileText size={18} color="#6366f1" /> Order History
                            </h3>
                            {ordersLoading ? <div style={{ textAlign: 'center', padding: '20px' }}><Loader2 className="animate-spin" /></div> : (
                                <div className="orders-history-list">
                                    {userOrders.length === 0 ? (
                                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>No orders found for this user.</p>
                                    ) : (
                                        userOrders.map(o => (
                                            <div key={o.id} className="history-order-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', background: '#f8fafc', borderRadius: '10px', marginBottom: '8px' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>Order #{o.id}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '700', color: '#6366f1' }}>LKR {o.totalAmount}</div>
                                                    <div className={`status-badge status-${o.status}`} style={{ fontSize: '10px' }}>{o.status.toUpperCase()}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
