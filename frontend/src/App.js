import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import HistoryPage from './pages/HistoryPage';

function App() {
  // נבדוק ב-localStorage אם המשתמש כבר מחובר
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsAuthenticated(true);
      setUserId(user.id); // נשמור את ה-ID מהמשתמש שהתחבר
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* העברנו את הפונקציה onLogin כדי לעדכן את הסטייט ב-App */}
        <Route 
          path="/login" 
          element={<Login onLogin={() => {
            setIsAuthenticated(true);
            const user = JSON.parse(localStorage.getItem('user'));
            setUserId(user?.id);
          }} />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/workspace/:subCategoryId" 
          element={isAuthenticated ? <Workspace /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/history" 
          element={isAuthenticated ? <HistoryPage userId={userId} /> : <Navigate to="/login" replace />} 
        />

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;