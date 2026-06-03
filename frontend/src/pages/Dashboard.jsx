import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // הוספת ייבוא של הניווט
import './Dashboard.css';

export default function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const navigate = useNavigate(); // אתחול כלי הניווט

    useEffect(() => {
        fetch('http://localhost:5000/api/categories') 
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setError("נכשלה טעינת הקטגוריות. ודא שהשרת פועל.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <div className="loading-spinner"></div>
                <h2 style={{ color: '#4a5568', marginTop: '20px' }}>טוען קטגוריות צבעוניות... ✨</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-box">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const bgColors = ['#e3fafc', '#fff9db', '#fff0f6', '#f3f0ff', '#ebfbee', '#feebec'];
    const borderColors = ['#99e9f2', '#ffe066', '#faa2c1', '#d0bfff', '#b2f2bb', '#ffc9c9'];
    const textColors = ['#0b7285', '#f59f00', '#d6336c', '#7048e8', '#2b8a3e', '#e03131'];
    const icons = ['💻', '🧠', '🎨', '🚀', '📊', '🌐'];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">מרכז הלמידה הצבעוני שלי 🌈</h1>
                <p className="dashboard-subtitle">בחר נושא מרתק ונתחיל ללמוד ולתרגל יחד עם ה-AI!</p>
            </header>

            {categories.length === 0 ? (
                <div className="no-categories-box">
                    <p>לאמצאו קטגוריות במערכת. יש להזין נתונים בבסיס הנתונים.</p>
                </div>
            ) : (
                <div className="categories-grid">
                    {categories.map((category, index) => {
                        const bgColor = bgColors[index % bgColors.length];
                        const borderColor = borderColors[index % borderColors.length];
                        const textColor = textColors[index % textColors.length];
                        const icon = icons[index % icons.length];

                        return (
                            <div 
                                key={category.id} 
                                className="category-card"
                                style={{ backgroundColor: bgColor, borderColor: borderColor }}
                                onClick={() => setSelectedCategory(category)}
                            >
                                <div className="card-icon" style={{ backgroundColor: '#ffffff', boxShadow: `0 4px 10px ${borderColor}` }}>
                                    {icon}
                                </div>
                                <h3 className="card-name" style={{ color: textColor }}>{category.name}</h3>
                                <p className="card-desc">לחץ כדי לראות תתי נושאים ולהתחיל לתרגל</p>
                                <span className="card-action-btn" style={{ color: textColor }}>להתחלת למידה ←</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedCategory && (
                <div className="modal-overlay" onClick={() => setSelectedCategory(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedCategory(null)}>✕</button>
                        
                        <div className="modal-header">
                            <h2>{selectedCategory.name}</h2>
                            <p>איזה נושא נרצה לתרגל עכשיו?</p>
                        </div>

                        <ul className="subcategory-list">
                            {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                                selectedCategory.subCategories.map((sub, subIdx) => {
                                    const subBg = bgColors[(subIdx + 2) % bgColors.length];
                                    const subBorder = borderColors[(subIdx + 2) % borderColors.length];
                                    const subText = textColors[(subIdx + 2) % textColors.length];

                                    return (
                                        <li 
                                            key={sub.id} 
                                            className="subcategory-item"
                                            style={{ backgroundColor: subBg, borderColor: subBorder }}
                                            onClick={() => {
                                                // ניווט לעמוד הלמידה עם ה-ID של תת הקטגוריה
                                                navigate(`/workspace/${sub.id}`);
                                            }}
                                        >
                                            <span className="sub-text" style={{ color: subText }}>{sub.name}</span>
                                            <span className="sub-arrow" style={{ color: subText }}>←</span>
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="no-subcategories">אין עדיין תתי-קטגוריות בנושא זה...</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}