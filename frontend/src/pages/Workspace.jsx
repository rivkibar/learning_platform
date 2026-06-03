import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Workspace() {
    const { subCategoryId } = useParams();
    const navigate = useNavigate();
    
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    useEffect(() => {
        // משיכת הפרומפטים לפי ה-ID של תת הקטגוריה
        fetch(`http://localhost:5000/api/subcategories/${subCategoryId}/prompts`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                setPrompts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("נכשלה טעינת המשימות עבור נושא זה.");
                setLoading(false);
            });
    }, [subCategoryId]);

    if (loading) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <div className="loading-spinner"></div>
                <h2 style={{ color: '#4a5568', marginTop: '20px' }}>מכין את משימות הלמידה... 🧠</h2>
            </div>
        );
    }

    const bgColors = ['#f3f0ff', '#e3fafc', '#fff9db', '#fff0f6', '#ebfbee'];
    const borderColors = ['#d0bfff', '#99e9f2', '#ffe066', '#faa2c1', '#b2f2bb'];
    const textColors = ['#7048e8', '#0b7285', '#f59f00', '#d6336c', '#2b8a3e'];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ textAlign: 'right', marginBottom: '40px' }}>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{
                        padding: '10px 20px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '20px',
                        transition: 'all 0.2s'
                    }}
                >
                    → חזרה לדשבורד
                </button>
                <h1 className="dashboard-title" style={{ fontSize: '2.4rem' }}>מרחב הלמידה והתרגול שלי 🚀</h1>
                <p className="dashboard-subtitle" style={{ margin: '0' }}>בחר משימה מוכנה מראש כדי לפתוח את הפרומפט המותאם ולהתחיל בצ'אט.</p>
            </header>

            {error ? (
                <div className="no-categories-box" style={{ borderColor: '#ffc9c9', backgroundColor: '#feebec' }}>
                    <p style={{ color: '#e03131', fontWeight: 'bold' }}>{error}</p>
                </div>
            ) : prompts.length === 0 ? (
                <div className="no-categories-box">
                    <p>אין עדיין משימות זמינות עבור נושא זה בבסיס הנתונים.</p>
                </div>
            ) : (
                <div className="categories-grid">
                    {prompts.map((promptItem, index) => {
                        const bgColor = bgColors[index % bgColors.length];
                        const borderColor = borderColors[index % borderColors.length];
                        const textColor = textColors[index % textColors.length];

                        // פיצול הכותרת מתוך שדה ה-prompt אם יש מקף, או הצגת כותרת גנרית
                        const titleText = promptItem.prompt.includes(' - ') 
                            ? promptItem.prompt.split(' - ')[0] 
                            : 'משימת תרגול מובנית';

                        return (
                            <div 
                                key={promptItem.id} 
                                className="category-card"
                                style={{ backgroundColor: bgColor, borderColor: borderColor }}
                                onClick={() => setSelectedPrompt(promptItem)}
                            >
                                <div className="card-icon" style={{ backgroundColor: '#ffffff', boxShadow: `0 4px 10px ${borderColor}` }}>
                                    📝
                                </div>
                                <h3 className="card-name" style={{ color: textColor }}>{titleText}</h3>
                                <p className="card-desc">
                                    {promptItem.response || "לחץ כדי לפתוח את הפרומפט המלא להתחלת התרגול."}
                                </p>
                                <span className="card-action-btn" style={{ color: textColor }}>פתח משימה ←</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* פופ-אפ להצגת הפרומפט המלא */}
            {selectedPrompt && (
                <div className="modal-overlay" onClick={() => setSelectedPrompt(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <button className="modal-close-btn" onClick={() => setSelectedPrompt(null)}>✕</button>
                        
                        <div className="modal-header">
                            <h2 style={{ color: '#1e293b' }}>פרומפט הלמידה שנבחר</h2>
                            <p style={{ marginTop: '5px' }}>הנה ההנחיה המוכנה שתישלח ל-AI לצורך תרגול:</p>
                        </div>

                        <div style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '20px',
                            borderRadius: '16px',
                            marginTop: '20px',
                            textAlign: 'right',
                            whiteSpace: 'pre-line',
                            color: '#334155',
                            fontSize: '0.95rem',
                            maxHeight: '250px',
                            overflowY: 'auto'
                        }}>
                            {selectedPrompt.prompt}
                        </div>

                        <div style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                            <button 
                                onClick={() => alert("השלב הבא: העברת המשימה ישירות לחלון הצ'אט האמיתי!")}
                                style={{
                                    background: '#2b8a3e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 25px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '1rem'
                                }}
                            >
                                התחל צ'אט למידה 💬
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}