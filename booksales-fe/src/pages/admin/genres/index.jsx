import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../_api";

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await API.get("/genres");
        setGenres(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data genre.");
      } finally {
        setLoading(false);
      }
    };

    getGenres();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus genre ini?")) return;

    try {
      await API.delete(`/genres/${id}`);
      setGenres(genres.filter((genre) => genre.id !== id));
      setNotice({ type: "success", text: "Genre berhasil dihapus." });
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setNotice({ type: "error", text: "Belum login atau sesi habis. Silakan login lagi." });
      } else if (status === 403) {
        setNotice({ type: "error", text: "Akun ini bukan admin, tidak boleh menghapus data." });
      } else if (status === 404) {
        setNotice({ type: "error", text: "Genre tidak ditemukan." });
      } else {
        setNotice({
          type: "error",
          text: "Gagal menghapus. Genre ini mungkin masih dipakai oleh buku.",
        });
      }
    }
  };

  const keyword = search.toLowerCase();
  const filtered = genres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(keyword) ||
      genre.description.toLowerCase().includes(keyword)
  );

  return (
    <section className="p-3 sm:p-5">
      <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2"
            />
          </div>

          <Link
            to="/admin/genres/create"
            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2 whitespace-nowrap"
          >
            + Add genre
          </Link>
        </div>

        {notice && (
          <p
            className={`px-4 pb-2 text-sm ${
              notice.type === "success" ? "text-green-700" : "text-red-600"
            }`}
          >
            {notice.text}
          </p>
        )}
        {loading && <p className="p-4 text-gray-500">Memuat data...</p>}
        {error && <p className="p-4 text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((genre) => (
                    <tr key={genre.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{genre.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {genre.name}
                      </td>
                      <td className="px-4 py-3">{genre.description}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/genres/${genre.id}/edit`}
                          className="font-medium text-indigo-600 hover:underline mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(genre.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="p-4 text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{genres.length}</span> genres
            </p>
          </>
        )}
      </div>
    </section>
  );
}