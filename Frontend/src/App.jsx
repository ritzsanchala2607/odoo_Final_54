
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import VenuesPage from './pages/VenuesPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import VenueDetails from './pages/VenueDetails';
import OwnerHomePage  from './pages/OwnerHomePage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/mybookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/venue/:id" element={<VenueDetails />} />
            <Route path="/admin" element={<Dashboard />} />
            {/* Catch-all route for any unmatched paths */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;