import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FileProvider } from './context/FileContext';

function App() {
  return (
    <Router>
      <FileProvider>
        <div className='App'>
          <Navbar />
          <div className='Content'>
            <Routes>
              <Route path="/" element={<Navigate to="/upload" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;
