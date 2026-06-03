import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Workspace() {
    const { subCategoryId } = useParams();
    const navigate = useNavigate();
    
    // ניהול ההודעות בצ'אט ותיבת הקלט
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    
    // אלמנט ייחוס (Ref) לצורך גלילה אוטומטית לתחתית הצ'אט
    const chatEndRef = useRef(null);

    // 1. שליפת היסטוריית ההודעות של תת-הקטגוריה הנוכחית בעת טעינת העמוד
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/subcategories/${subCategoryId}/prompts`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // המרת מבנה הנתונים מהדאטהבייס למבנה שהצ'אט יודע להציג
                    const formattedMessages = [];
                    data.forEach(item => {
                        if (item.prompt) formattedMessages.push({ sender: 'user', text: item.prompt });
                        if (item.response) formattedMessages.push({ sender: 'ai', text: item.response });
                    });
                    
                    setMessages(formattedMessages);
                }
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            }
        };

        if (subCategoryId) {
            fetchChatHistory();
        }
    }, [subCategoryId]);

    // 2. גלילה אוטומטית לתחתית חלון הצ'אט בכל פעם שרשימת ההודעות משתנה
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sendingMessage]);

    // 3. פונקציה לשליחת הפרומפט של המשתמש ל-AI
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || sendingMessage) return;

        const userText = inputValue;
        setInputValue('');
        
        // הצגת הודעת המשתמש בצ'אט מיד
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setSendingMessage(true);

        try {
            // פנייה מדויקת ל-Backend לנתיב המאוחד /api/ask
            const response = await fetch('http://localhost:5000/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    promptText: userText, 
                    userId: 1, // מזהה משתמש קבוע (סטטי) לפרויקט הנוכחי
                    subCategoryId: parseInt(subCategoryId)
                })
            });

            if (!response.ok) throw new Error("Failed to get response from AI");
            const data = await response.json();

            // הצגת תשובת ה-AI מתוך השדה response שחוזר מהדאטהבייס
            setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: 'ai', text: "מצטער, חלה שגיאה בעיבוד הבקשה. נסה שוב." }]);
        } finally {
            setSendingMessage(false);
        }
    };

    return (
        <div className="dashboard-container" style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
            <header className="dashboard-header" style={{ textAlign: 'right', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="dashboard-title" style={{ fontSize: '2rem', marginBottom: '5px' }}>מרחב הלמידה שלי 🚀</h1>
                    <p className="dashboard-subtitle" style={{ margin: '0' }}>כתוב לבינה המלאכותית מה תרצה ללמוד והתחל בשיעור.</p>
                </div>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: '#ffffff', fontWeight: '600', color: '#475569' }}>
                    → חזרה לדשבורד
                </button>
            </header>

            {/* חלון הצ'אט */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', height: '480px', overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '140px' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🧠</div>
                        <h3 style={{ color: '#64748b', margin: '0 0 5px 0' }}>הצ'אט מוכן!</h3>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>הקלד למטה פרומפט חופשי (למשל: "הסבר לי את הנושא ב-5 נקודות") כדי להתחיל.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', 
                                backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#f1f5f9', 
                                color: msg.sender === 'user' ? '#ffffff' : '#1e293b', 
                                padding: '14px 20px', 
                                borderRadius: msg.sender === 'user' ? '20px 20px 2px 20px' : '20px 20px 20px 2px', 
                                maxWidth: '75%', 
                                direction: 'rtl', 
                                textAlign: 'right', 
                                whiteSpace: 'pre-line' 
                            }}
                        >
                            {msg.text}
                        </div>
                    ))
                )}
                
                {/* אינדיקטור טעינה כאשר הבינה המלאכותית מנסחת תשובה */}
                {sendingMessage && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: '#e2e8f0', padding: '12px 18px', borderRadius: '16px', color: '#64748b', direction: 'rtl' }}>
                        ה-AI מכין את השיעור עבורך... ✍️
                    </div>
                )}
                
                {/* נקודת עוגן לגלילה האוטומטית */}
                <div ref={chatEndRef} />
            </div>

            {/* תיבת קלט */}
            <form onSubmit={handleSendMessage} style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="כתוב כאן את הפרומפט שלך..." 
                    disabled={sendingMessage}
                    style={{ flex: 1, padding: '16px 22px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', textAlign: 'right' }}
                />
                <button 
                    type="submit" 
                    disabled={sendingMessage || !inputValue.trim()} 
                    style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0 30px', 
                        borderRadius: '16px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        opacity: (sendingMessage || !inputValue.trim()) ? 0.5 : 1 
                    }}
                >
                    שלח פרומפט
                </button>
            </form>
        </div>
    );
}