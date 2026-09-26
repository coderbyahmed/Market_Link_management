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
import AdminLogin from "../pages/auth/AdminLogin.jsx";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard.jsx";
import AdminProfile from "../pages/admin/profile/AdminProfile.jsx";
import AdminNotifications from "../pages/admin/notifications/AdminNotifications.jsx";
import AdminAllUsers from "../pages/admin/users/AdminAllUsers.jsx";
import AdminFarmers from "../pages/admin/users/AdminFarmers.jsx";
import AdminCustomers from "../pages/admin/users/AdminCustomers.jsx";
import AdminAllProducts from "../pages/admin/products/AdminAllProducts.jsx";
import AdminPendingProducts from "../pages/admin/products/AdminPendingProducts.jsx";
import AdminApprovedProducts from "../pages/admin/products/AdminApprovedProducts.jsx";
import FarmerDashboard from "../pages/farmer/FarmerDashboard.jsx";
import FarmerProfile from "../pages/farmer/FarmerProfile.jsx";
import FarmerNotifications from "../pages/farmer/FarmerNotifications.jsx";
import FarmerAllProducts from "../pages/farmer/products/AllProducts.jsx";
import FarmerAddProduct from "../pages/farmer/products/AddProduct.jsx";
import FarmerProductRequests from "../pages/farmer/products/ProductRequests.jsx";
import FarmerWeeklyStock from "../pages/farmer/products/WeeklyStock.jsx";
import FarmerOrders from "../pages/farmer/Orders.jsx";
import FarmerCropListings from "../pages/farmer/CropListings.jsx";
import FarmerReviews from "../pages/farmer/Reviews.jsx";
import FarmerReports from "../pages/farmer/Reports.jsx";
import FarmerSettings from "../pages/farmer/Settings.jsx";
import CustomerLayout from "../components/customer/layout/CustomerLayout.jsx";
import CustomerHome from "../pages/customer/Home.jsx";
import CustomerProducts from "../pages/customer/Products.jsx";
import CustomerProductDetails from "../pages/customer/ProductDetails.jsx";
import CustomerCategories from "../pages/customer/Categories.jsx";
import CustomerCart from "../pages/customer/Cart.jsx";
import CustomerCheckout from "../pages/customer/Checkout.jsx";
import CustomerOrders from "../pages/customer/Orders.jsx";
import CustomerOrderDetails from "../pages/customer/OrderDetails.jsx";
import CustomerReviews from "../pages/customer/Reviews.jsx";
import CustomerWishlist from "../pages/customer/Wishlist.jsx";
import CustomerProfile from "../pages/customer/Profile.jsx";
import CustomerAbout from "../pages/customer/About.jsx";
import CustomerContact from "../pages/customer/Contact.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import { AdminProfileImageProvider } from "../context/AdminProfileImageProvider.jsx";
import { FarmerProfileImageProvider } from "../context/FarmerProfileImageProvider.jsx";

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

        <Route path="/admin/login/:adminAccessId" element={<AdminLogin />} />

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
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminNotifications />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminAllUsers />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/farmers"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminFarmers />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/customers"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminCustomers />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminAllProducts />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/pending"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminPendingProducts />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/approved"
          element={
            <ProtectedRoute role="admin">
              <AdminProfileImageProvider>
                <AdminApprovedProducts />
              </AdminProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer"
          element={
            <ProtectedRoute role="farmer">
              <Navigate to="/farmer/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerDashboard />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/profile"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerProfile />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/notifications"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerNotifications />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerAllProducts />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products/add"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerAddProduct />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products/requests"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerProductRequests />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products/weekly-stock"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerWeeklyStock />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/orders"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerOrders />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/crop-listings"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerCropListings />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/reviews"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerReviews />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/reports"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerReports />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/settings"
          element={
            <ProtectedRoute role="farmer">
              <FarmerProfileImageProvider>
                <FarmerSettings />
              </FarmerProfileImageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="products" element={<CustomerProducts />} />
          <Route path="products/:productId" element={<CustomerProductDetails />} />
          <Route path="categories" element={<CustomerCategories />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="checkout" element={<CustomerCheckout />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="orders/:orderId" element={<CustomerOrderDetails />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="about" element={<CustomerAbout />} />
          <Route path="contact" element={<CustomerContact />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;