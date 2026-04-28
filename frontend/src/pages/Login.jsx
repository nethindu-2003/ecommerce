import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            const { token, role } = response.data;

            if (selectedRole === 'admin' && role !== 'admin') {
                setError('Access Denied: You do not have admin privileges.');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            
            // Redirect based on the role the user SELECTED in the UI
            if (selectedRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in as <strong>{selectedRole === 'admin' ? 'Administrator' : 'Customer'}</strong></p>
                </div>

                <div className="role-selector">
                    <button 
                        type="button"
                        className={selectedRole === 'user' ? 'active' : ''}
                        onClick={() => setSelectedRole('user')}
                    >
                        <UserIcon size={18} /> User
                    </button>
                    <button 
                        type="button"
                        className={selectedRole === 'admin' ? 'active' : ''}
                        onClick={() => setSelectedRole('admin')}
                    >
                        <ShieldCheck size={18} /> Admin
                    </button>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label><Mail size={18} /> Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label><Lock size={18} /> Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="/register">Create one</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
