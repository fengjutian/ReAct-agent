import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Counter from './components/Counter';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './hooks/useAuth';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<div>
            <h1>Vite + React + TypeScript</h1>
            <div className="card">
              <Counter />
            </div>
          </div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;