import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!name.trim() || !phone.trim()) {
            setError('נא למלא את כל השדות');
            return;
        }

        try {
            setLoading(true);
            // פנייה ל-API להרשמה או התחברות
            const response = await userAPI.loginOrRegister({ name, phone });
            console.log("תשובת השרת:", response);
            // שמירת המשתמש ב-localStorage כדי לשמור על חיבור גם ברענון דף
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // עדכון הסטייט ב-App.js וניווט לדשבורד
            if (onLogin) {
                onLogin();
            }
            navigate('/dashboard');
            
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'שגיאה בהתחברות לשרת. ודא שה-Backend דלוק.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>ברוכים הבאים לפלטפורמת הלמידה</h2>
                <p style={styles.subtitle}>התחבר או הרשם בכמה שניות כדי להתחיל ללמוד עם AI</p>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>שם מלא:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="ישראל ישראלי"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>מספר טלפון:</label>
                        <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="0501234567"
                            style={styles.input}
                        />
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'מתחבר...' : 'כניסה למערכת'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', direction: 'rtl' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    title: { margin: '0 0 10px 0', color: '#1f2937', fontSize: '24px' },
    subtitle: { margin: '0 0 25px 0', color: '#6b7280', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', textAlign: 'right', gap: '5px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#374151' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', outline: 'none' },
    error: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '6px', fontSize: '14px' },
    button: { padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Login;