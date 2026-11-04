import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../_api";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await API.get("/books");
        setBooks(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  const handleDelete = async (id) => {
    setOpenId(null);
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;

    try {
      await API.delete(`/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
      setMessage("Buku berhasil dihapus.");
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setMessage("Belum login atau sesi habis. Silakan login lagi.");
      } else if (status === 403) {
        setMessage("Akun ini bukan admin, tidak boleh menghapus data.");
      } else {
        setMessage("Gagal menghapus buku.");
      }
    }
  };

  const keyword = search.toLowerCase();
  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(keyword)
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
            to="/admin/books/create"
            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2 whitespace-nowrap"
          >
            + Add book
          </Link>
        </div>

        {message && <p className="px-4 pb-2 text-sm text-indigo-700">{message}</p>}
        {loading && <p className="p-4 text-gray-500">Memuat data...</p>}
        {error && <p className="p-4 text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto pb-24">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Cover</th>
                    <th className="px-4 py-3">Genre</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {book.title}
                      </td>
                      <td className="px-4 py-3">
                        {Number(book.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">{book.stock}</td>
                      <td className="px-4 py-3">{book.cover_photo}</td>
                      <td className="px-4 py-3">{book.genre?.name}</td>
                      <td className="px-4 py-3">{book.author?.name}</td>
                      <td className="px-4 py-3 text-right relative">
                        <button
                          onClick={() =>
                            setOpenId(openId === book.id ? null : book.id)
                          }
                          className="p-1 text-gray-500 hover:text-gray-900 rounded"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>

                        {openId === book.id && (
                          <div className="absolute right-4 z-10 w-32 bg-white rounded-lg shadow border text-left">
                            <Link
                              to={`/admin/books/${book.id}/edit`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="px-4 pb-4 text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{books.length}</span> books
            </p>
          </>
        )}
      </div>
    </section>
  );
}