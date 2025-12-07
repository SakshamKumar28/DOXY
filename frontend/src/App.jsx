import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Unauthorized from './pages/Unauthorized';

import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointments from './pages/PatientAppointments';
import PatientPrescriptions from './pages/PatientPrescriptions';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorSchedule from './pages/DoctorSchedule';
import VideoCall from './pages/VideoCall';
import AppLayout from './components/layout/AppLayout';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>; // Replace with a nice spinner later

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
     // Redirect to Unauthorized instead of Home to prevent loops
     return <Navigate to="/unauthorized" state={{ requiredRoles: allowedRoles }} replace />;
  }

  return <Outlet />;
};



function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Authenticated Routes with Sidebar Layout */}
            <Route element={<AppLayout />}>
                {/* Patient Routes */}
                <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/appointments" element={<PatientAppointments />} />
                <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
                <Route path="/call/:roomId" element={<VideoCall />} />
                </Route>

                {/* Doctor Routes */}
                <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/schedule" element={<DoctorSchedule />} />
                <Route path="/doctor/call/:roomId" element={<VideoCall />} /> 
                <Route path="/doctor/settings" element={<Settings />} />
                </Route>
                
                {/* Common Authenticated Routes */}
                <Route path="/patient/settings" element={<Settings />} />
            </Route>

          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
                className: 'bg-background text-foreground border border-border',
            }}
          />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
