import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User, Mail, Calendar, Power, PowerOff, ShoppingBag, X, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);

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
            await api.patch(`/admin/users/${id}/toggle`);
            fetchUsers();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setOrdersLoading(true);
        try {
            const res = await api.get(`/admin/users/${user.id}/orders`);
            setUserOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setOrdersLoading(false);
        }
    };

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>User Management</h1>
                <p>Manage customer accounts and monitor their activities.</p>
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
                        {users.map(u => (
                            <tr key={u.id} onClick={() => handleUserClick(u)} className="clickable-row">
                                <td>{u.name || 'N/A'}</td>
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
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button onClick={() => setSelectedUser(null)}><X /></button>
                        </div>
                        <div className="modal-body">
                            <div className="user-info-section">
                                <div className="info-item"><User size={20}/> <strong>Name:</strong> {selectedUser.name}</div>
                                <div className="info-item"><Mail size={20}/> <strong>Email:</strong> {selectedUser.email}</div>
                                <div className="info-item"><Calendar size={20}/> <strong>Birthday:</strong> {selectedUser.birthday || 'Not set'}</div>
                            </div>

                            <hr />
                            <h3><ShoppingBag size={20}/> Order History</h3>
                            {ordersLoading ? <Loader2 className="animate-spin" /> : (
                                <div className="orders-history-list">
                                    {userOrders.length === 0 ? <p>No orders found.</p> : (
                                        userOrders.map(o => (
                                            <div key={o.id} className="history-order-item">
                                                <span>Order #{o.id}</span>
                                                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                                                <span className={`status-${o.status}`}>${o.totalAmount} ({o.status})</span>
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
