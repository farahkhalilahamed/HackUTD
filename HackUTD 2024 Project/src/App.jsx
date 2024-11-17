import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FileProvider } from './context/FileContext'; // Import the context provider

function App() {
  return (
    <Router>
      <FileProvider> {/* Wrap the app with the FileProvider */}
        <div className='App'>
          <Navbar />
          <div className='Content'>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;
