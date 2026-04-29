import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User, Mail, Lock, Calendar, VenusAndMars, Loader2, Save, CheckCircle2, XCircle } from 'lucide-react';

const UserSettings = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', gender: '', birthday: '', password: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', msg: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                setFormData({ ...res.data, password: '' });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const passwordChecks = {
        length: formData.password.length >= 8,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[@$!%*?&]/.test(formData.password),
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (formData.password && !Object.values(passwordChecks).every(Boolean)) {
            return setFeedback({ type: 'error', msg: 'Please meet all password requirements' });
        }

        setSaving(true);
        setFeedback({ type: '', msg: '' });
        try {
            await api.patch('/user/user/profile', formData); // Corrected endpoint if needed
            // Note: In userRoutes I mounted it as /api/user/profile
            // So with api.patch('/user/profile') it works
            await api.patch('/user/profile', formData);
            setFeedback({ type: 'success', msg: 'Profile updated successfully!' });
            setFormData({ ...formData, password: '' });
        } catch (err) {
            setFeedback({ type: 'error', msg: err.response?.data?.message || 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Account Settings</h1>
            </div>
            <p>Manage your personal information and security preferences.</p><br></br>
            {feedback.msg && (
                <div className={`feedback-alert ${feedback.type}`} style={{ marginBottom: '24px' }}>
                    {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {feedback.msg}
                </div>
            )}

            <div className="settings-container" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSave} className="admin-form">
                    <div className="form-group">
                        <label><Mail size={18} /> Email Address (Read Only)</label>
                        <input type="email" value={formData.email} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
                    </div>

                    <div className="form-group">
                        <label><User size={18} /> Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label><VenusAndMars size={18} /> Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label><Calendar size={18} /> Birthday</label>
                            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
                        </div>
                    </div>

                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <h3>Security</h3>

                    <div className="form-group">
                        <label><Lock size={18} /> New Password (leave blank to keep current)</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    </div>

                    {formData.password && (
                        <div className="password-checklist" style={{ marginBottom: '24px' }}>
                            <p className={passwordChecks.length ? 'valid' : 'invalid'}>
                                {passwordChecks.length ? <CheckCircle2 size={14} /> : <XCircle size={14} />} 8+ characters
                            </p>
                            <p className={passwordChecks.upper && passwordChecks.lower ? 'valid' : 'invalid'}>
                                {passwordChecks.upper && passwordChecks.lower ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Upper & Lowercase
                            </p>
                            <p className={passwordChecks.number ? 'valid' : 'invalid'}>
                                {passwordChecks.number ? <CheckCircle2 size={14} /> : <XCircle size={14} />} At least one number
                            </p>
                            <p className={passwordChecks.special ? 'valid' : 'invalid'}>
                                {passwordChecks.special ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Special character
                            </p>
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="submit-btn">
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;
