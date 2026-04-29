import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserOrders from './pages/user/UserOrders';
import UserSettings from './pages/user/UserSettings';

// User Only Route Component
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'user') return <Navigate to="/login" />;
  return children;
};

// Admin Only Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes wrapped in Layout */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="settings" element={<SettingsManagement />} />
          <Route index element={<Navigate to="/admin/dashboard" />} />
        </Route>

        <Route 
          path="/" 
          element={
            <UserRoute>
              <UserLayout />
            </UserRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="settings" element={<UserSettings />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
