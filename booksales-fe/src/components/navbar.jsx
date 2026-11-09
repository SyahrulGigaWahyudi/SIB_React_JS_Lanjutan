import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-700">
          Book Sales
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
                Halo, <span className="font-semibold">{user.name}</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5">
                  {user.role}
                </span>
              </span>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-lg px-4 py-2"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg px-4 py-2"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg px-4 py-2"
              >
                Bergabung
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}