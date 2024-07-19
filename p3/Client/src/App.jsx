import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DotsLoader from './pages/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notifications from './pages/Notifications';
import UserList from './pages/admin/UserList';
import DoctorsList from './pages/admin/DoctorsList';
import Profile from './pages/doctor/Profile';
import Doctor from './components/Booking';
import UserAppointments from './pages/UserAppointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const loading = useSelector((state) => state.alerts.loading);

  return (
    <>
      <Router>
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-gray-200 z-50">
            <DotsLoader />
          </div>
        )}
        <div className={loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
        <ToastContainer />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/apply-Professionals" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
            <Route path="/Professionals" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
            <Route path="/Professionals/profile/:doctorId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/Professionals/:doctorId" element={<ProtectedRoute><Doctor/></ProtectedRoute>} />
            <Route path="/user-appointments" element={<ProtectedRoute>< UserAppointments /></ProtectedRoute>} />
            <Route path="/Professionals-appointments" element={<ProtectedRoute><  DoctorAppointments /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
