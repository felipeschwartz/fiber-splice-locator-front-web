import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WelcomePage from './pages/WelcomePage';
import ReportsPage from './pages/ReportsPage';
import UsersListPage from './pages/UsersListPage';
import UserCreatePage from './pages/UserCreatePage';
import UserEditPage from './pages/UserEditPage';
import CeosListPage from './pages/CeosListPage';
import CeoCreatePage from './pages/CeoCreatePage';
import CeoEditPage from './pages/CeoEditPage';
import CeoDetailPage from './pages/CeoDetailPage';
import ServiceOrdersListPage from './pages/ServiceOrdersListPage';
import ServiceOrderDetailPage from './pages/ServiceOrderDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/service-orders" element={<ServiceOrdersListPage />} />
            <Route path="/service-orders/:id" element={<ServiceOrderDetailPage />} />

            <Route path="/ceos" element={<CeosListPage />} />
            <Route path="/ceos/new" element={<CeoCreatePage />} />
            <Route path="/ceos/:id" element={<CeoDetailPage />} />
            <Route path="/ceos/:id/edit" element={<CeoEditPage />} />

            <Route path="/users" element={<UsersListPage />} />
            <Route path="/users/new" element={<UserCreatePage />} />
            <Route path="/users/:id/edit" element={<UserEditPage />} />

            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
