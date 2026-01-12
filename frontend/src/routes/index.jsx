import { Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import Profile from '@pages/Profile';
import HelpCenter from '@pages/HelpCenter';
import Doctors from '@pages/Doctors';
import DoctorDashboard from '@pages/DoctorDashboard';
import AdminDashboard from '@pages/AdminDashboard';
import PaymentPage from '@pages/PaymentPage';
import ProtectedRoute from '@components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/doctor"
                element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                        <DoctorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <ProtectedRoute>
                        <PaymentPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/help" element={<HelpCenter />} />
        </Routes>
    );
};

export default AppRoutes;
