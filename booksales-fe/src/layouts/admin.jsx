import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const menus = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/genres", label: "Genres" },
  { to: "/admin/authors", label: "Authors" },
  { to: "/admin/books", label: "Books" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar atas */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/admin" className="text-xl font-bold text-indigo-700">
              Book Sales{" "}
              <span className="text-xs font-medium text-gray-500">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:block text-sm font-medium text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-lg px-4 py-2"
            >
              Lihat beranda
            </Link>
            <span className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg px-4 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-screen pt-16 bg-white border-r border-gray-200 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-3 space-y-1">
          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              end={menu.end}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              {menu.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Isi halaman */}
      <main className="pt-16 md:ml-64">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}