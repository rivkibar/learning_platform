import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css'; 
const HistoryPage = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
    const userString = localStorage.getItem('user');
    
    if (!userString) {
        setError("לא נמצא משתמש מחובר");
        setLoading(false);
        return;
    }

    try {
        const parsedData = JSON.parse(userString);
      
        const userId = parsedData.user ? parsedData.user.id : null; 

        if (!userId) {
            console.error("המבנה של המשתמש ב-localStorage לא מכיל id", parsedData);
            setError("שגיאה בנתוני המשתמש.");
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:5000/api/history/${userId}`)
            .then(res => {
        console.log("נתונים שהתקבלו מהשרת:", res.data);

                setHistory(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("לא הצלחנו לטעון את ההיסטוריה.");
                setLoading(false);
            });
    } catch (e) {
        setError("שגיאה בקריאת נתוני המשתמש.");
        setLoading(false);
    }
}, []);

  if (loading) return <div className="history-status">טוען את מסע הלמידה שלך... ⏳</div>;
  if (error) return <div className="history-status error">{error}</div>;

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>היסטוריית הלמידה שלי 📚</h1>
        <p>כאן תוכל לצפות בכל הנושאים והשיעורים שלמדת</p>
      </header>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="no-data">עדיין לא למדת נושאים חדשים. בוא נתחיל! 🚀</p>
        ) : (
          history.map(item => (
            <div key={item.id} className="history-card">
              <div className="card-meta">
                <span className="category-tag">{item.category.name}</span>
                <span className="subcategory-tag">{item.subCategory.name}</span>
                <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="card-content">
                <p><strong>השאלה שלך:</strong> {item.prompt}</p>
                <div className="ai-response">
                  <strong>תשובת ה-AI:</strong>
                  <p>{item.response}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;