import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // ייבוא רכיב הדשבורד האמיתי והמעוצב
import Workspace from './pages/Workspace'; // 1. מייבאים את עמוד מרחב העבודה החדש

// רכיבי דמה זמניים - נחליף אותם בעמודים אמיתיים בשלבים הבאים
const ChatDummy = () => <div style={{ padding: 40, textAlign: 'center', direction: 'rtl' }}><h2>חלון צ'אט AI (בקרוב...)</h2></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* נתיב למסך ההתחברות */}
        <Route path="/login" element={<Login />} />
        
        {/* נתיב למסך הראשי (בחירת נושאים) - עודכן לרכיב האמיתי */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 2. נתיב למסך הלמידה מול ה-AI - מקבל בצורה דינמית את ה-ID של תת הקטגוריה */}
        <Route path="/workspace/:subCategoryId" element={<Workspace />} />
        
        {/* נתיב למסך הלמידה הישן (אם תצטרך אותו זמנית) */}
        <Route path="/chat" element={<ChatDummy />} />
        
        {/* הגנת ברירת מחדל: כל כתובת אחרת תפנה אוטומטית למסך הלוגין */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;