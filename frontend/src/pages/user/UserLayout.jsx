import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/orders', icon: <ShoppingBag size={20} />, label: 'My Orders' },
        { path: '/settings', icon: <UserIcon size={20} />, label: 'Profile Settings' },
    ];

    return (
        <div className="admin-layout user-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Store Account</h2>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
