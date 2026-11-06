import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../_api";
import FormInput from "../../components/forminput";

const initialForm = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const benefits = [
  "Koleksi buku dari berbagai genre dan penulis",
  "Proses pembelian yang mudah dan cepat",
  "Data akunmu tersimpan dengan aman",
];

const validate = (form) => {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Nama lengkap wajib diisi.";
  } else if (form.fullName.trim().length < 3) {
    errors.fullName = "Nama lengkap minimal 3 karakter.";
  }

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.username.trim()) {
    errors.username = "Username wajib diisi.";
  } else if (!/^[a-zA-Z0-9_]{4,}$/.test(form.username)) {
    errors.username =
      "Username minimal 4 karakter, hanya huruf, angka, dan garis bawah.";
  }

  if (!form.password) {
    errors.password = "Password wajib diisi.";
  } else if (form.password.length < 6) {
    errors.password = "Password minimal 6 karakter.";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password wajib diisi.";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Konfirmasi password tidak sama.";
  }

  return errors;
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await API.post("/register", {
        name: form.fullName,
        email: form.email,
        username: form.username,
        password: form.password,
      });

      setSuccess("Registrasi berhasil! Mengarahkan ke halaman login...");
      setForm(initialForm);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.message;
        setErrors({
          fullName: serverErrors.name?.[0],
          email: serverErrors.email?.[0],
          username: serverErrors.username?.[0],
          password: serverErrors.password?.[0],
        });
      } else {
        setMessage("Terjadi kesalahan, coba lagi.");
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
          <p className="text-indigo-100 text-lg mb-8">
            Bergabung sekarang dan temukan buku favoritmu.
          </p>

          <ul className="space-y-4">
            {benefits.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-indigo-50">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Panel kanan: form registrasi */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <p className="lg:hidden text-xl font-bold text-indigo-700 mb-4">
            Book Sales
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Buat akun baru</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Isi data di bawah untuk mendaftar.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormInput
              id="fullName"
              label="Nama lengkap"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nama lengkap kamu"
              error={errors.fullName}
              autoComplete="name"
            />

            <FormInput
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              error={errors.email}
              autoComplete="email"
            />

            <FormInput
              id="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              placeholder="username_kamu"
              error={errors.username}
              autoComplete="username"
            />

            <FormInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              error={errors.password}
              autoComplete="new-password"
            />

            <FormInput
              id="confirmPassword"
              label="Konfirmasi password"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Kotak centang buatan sendiri, warnanya tidak bergantung tema browser */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                className="sr-only"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span
                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition ${
                  showPassword
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white border-gray-400"
                }`}
              >
                {showPassword && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              Tampilkan password
            </label>

            {message && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {message}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 font-medium rounded-lg text-sm px-5 py-3 shadow-md"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:underline"
              >
                Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}