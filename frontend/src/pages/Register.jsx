import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, CheckCircle2, XCircle, User as UserIcon, Calendar, VenusAndMars } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        gender: '',
        birthday: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checks = {
        length: formData.password.length >= 8,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[@$!%*?&]/.test(formData.password),
    };

    const validateForm = () => {
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!Object.values(checks).every(Boolean)) {
            setError('Please meet all password requirements.');
            return false;
        }
        if (!formData.name) {
            setError('Please enter your full name.');
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        try {
            await api.post('/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '480px' }}>
                <div className="login-header">
                    <h1>Create Account</h1>
                    <p>Start your shopping journey with us</p>
                </div>
                
                <form onSubmit={handleRegister} className="login-form">
                    <div className="form-group">
                        <label><UserIcon size={18} /> Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label><VenusAndMars size={18} /> Gender</label>
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Private</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label><Calendar size={18} /> Birthday</label>
                            <input 
                                type="date" 
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label><Mail size={18} /> Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label><Lock size={18} /> Password</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="password-checklist">
                        <p className={checks.length ? 'valid' : 'invalid'}>
                            {checks.length ? <CheckCircle2 size={14} /> : <XCircle size={14} />} 8+ characters
                        </p>
                        <p className={checks.upper && checks.lower ? 'valid' : 'invalid'}>
                            {checks.upper && checks.lower ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Upper & Lowercase
                        </p>
                        <p className={checks.number ? 'valid' : 'invalid'}>
                            {checks.number ? <CheckCircle2 size={14} /> : <XCircle size={14} />} At least one number
                        </p>
                        <p className={checks.special ? 'valid' : 'invalid'}>
                            {checks.special ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Special character
                        </p>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already have an account? <a href="/login">Sign In</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
