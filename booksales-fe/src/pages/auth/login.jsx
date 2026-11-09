import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../_api";
import FormInput from "../../components/forminput";
import { useAuth } from "../../context/authcontext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/login", { email, password });
      const { token, user } = response.data;

      login(token, user);

      // Admin ke dashboard, user biasa kembali ke halaman asal atau beranda
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(location.state?.from || "/");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email atau password salah.");
      } else {
        setError("Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex bg-gray-50">
      {/* Panel kiri: hanya tampil di layar besar */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white items-center justify-center p-12"
        style={{
          background:
            "linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #818cf8 100%)",
        }}
      >
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute -bottom-28 -right-16 w-96 h-96 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold mb-4">Book Sales</h2>
          <p className="text-indigo-100 text-lg">
            Selamat datang kembali. Masuk untuk membeli buku favoritmu atau
            mengelola koleksi toko.
          </p>
        </div>
      </div>

      {/* Panel kanan: form login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <p className="lg:hidden text-xl font-bold text-indigo-700 mb-4">
            Book Sales
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke akunmu</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Masukkan email dan password untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password kamu"
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 font-medium rounded-lg text-sm px-5 py-3 shadow-md"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:underline"
              >
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}