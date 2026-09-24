import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing.jsx";
import LoginSelect from "../pages/auth/LoginSelect.jsx";
import GetStarted from "../pages/auth/GetStarted.jsx";
import Marketplace from "../pages/Marketplace.jsx";
import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Signup.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import VerifyOTP from "../pages/auth/VerifyOTP.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";
import FarmerDashboard from "../pages/farmer/FarmerDashboard.jsx";
import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import { AdminProfileImageProvider } from "../context/AdminProfileImageProvider.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<LoginSelect />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/forgot-password/:role" element={<ForgotPassword />} />
        <Route path="/verify-otp/:role" element={<VerifyOTP />} />
        <Route path="/reset-password/:role" element={<ResetPassword />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminDashboard />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminProfile />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;