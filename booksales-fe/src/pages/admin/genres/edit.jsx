import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../../_api";

export default function GenreEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ambil data lama untuk mengisi form
  useEffect(() => {
    const getGenre = async () => {
      try {
        const response = await API.get(`/genres/${id}`);
        setName(response.data.data.name);
        setDescription(response.data.data.description);
      } catch (err) {
        if (err.response?.status === 404) {
          setLoadError("Genre tidak ditemukan.");
        } else {
          setLoadError("Gagal mengambil data genre.");
        }
      } finally {
        setLoadingData(false);
      }
    };

    getGenre();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setSaving(true);

    try {
      await API.put(`/genres/${id}`, { name, description });
      navigate("/admin/genres");
    } catch (err) {
      const status = err.response?.status;

      if (status === 422) {
        setErrors(err.response.data.message);
      } else if (status === 401) {
        setMessage("Belum login atau sesi habis. Silakan login lagi.");
      } else if (status === 403) {
        setMessage("Akun ini bukan admin, tidak boleh mengubah data.");
      } else if (status === 404) {
        setMessage("Genre tidak ditemukan.");
      } else {
        setMessage("Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-3 sm:p-5">
      <div className="bg-white shadow-md sm:rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Genre</h2>

        {loadingData && <p className="text-gray-500">Memuat data...</p>}

        {loadError && (
          <div>
            <p className="text-red-600 mb-4">{loadError}</p>
            <Link to="/admin/genres" className="text-indigo-600 hover:underline text-sm">
              Kembali ke daftar
            </Link>
          </div>
        )}

        {!loadingData && !loadError && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
              )}
            </div>

            {message && <p className="text-sm text-red-600">{message}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {saving ? "Menyimpan..." : "Update Genre"}
              </button>
              <Link
                to="/admin/genres"
                className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}