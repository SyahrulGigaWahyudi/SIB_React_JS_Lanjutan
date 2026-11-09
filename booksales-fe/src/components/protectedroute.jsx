import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";

// role (opsional): kalau diisi, hanya pengguna dengan role itu yang boleh masuk
export default function ProtectedRoute({ role }) {
  const { user } = useAuth();
  const location = useLocation();

  // Belum login: arahkan ke halaman login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Sudah login tapi role tidak sesuai: kembalikan ke beranda
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}