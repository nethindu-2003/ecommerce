import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Settings, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const SettingsManagement = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // ID of the setting being saved
    const [feedback, setFeedback] = useState({ type: '', msg: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings');
            setSettings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleValueChange = (id, newValue) => {
        setSettings(settings.map(s => s.id === id ? { ...s, value: newValue } : s));
    };

    const saveSetting = async (setting) => {
        setUpdating(setting.id);
        setFeedback({ type: '', msg: '' });
        try {
            await api.patch(`/admin/settings/${setting.id}`, { value: setting.value });
            setFeedback({ type: 'success', msg: `"${setting.key}" updated successfully!` });
            setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
        } catch (err) {
            setFeedback({ type: 'error', msg: `Failed to update "${setting.key}".` });
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <div className="admin-loading"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>System Settings</h1>
            </div>
            <p>Configure global parameters and store preferences.</p>
            <br></br>
            {feedback.msg && (
                <div className={`feedback-alert ${feedback.type}`}>
                    {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {feedback.msg}
                </div>
            )}

            <div className="settings-container">
                {settings.length === 0 ? (
                    <div className="no-data">No settings found in the database.</div>
                ) : (
                    <div className="settings-list">
                        {settings.map(s => (
                            <div key={s.id} className="setting-card">
                                <div className="setting-info">
                                    <label className="setting-key">{s.key.replace(/_/g, ' ')}</label>
                                    <span className="setting-description">System configuration key</span>
                                </div>
                                <div className="setting-action">
                                    <input
                                        type="text"
                                        className="setting-input"
                                        value={s.value}
                                        onChange={(e) => handleValueChange(s.id, e.target.value)}
                                    />
                                    <button
                                        className="save-btn"
                                        disabled={updating === s.id}
                                        onClick={() => saveSetting(s)}
                                    >
                                        {updating === s.id ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsManagement;
