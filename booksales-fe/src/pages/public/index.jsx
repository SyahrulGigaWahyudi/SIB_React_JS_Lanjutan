import { useEffect, useState } from "react";
import API from "../../_api";
import BookCard from "../../components/bookcard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const [bookRes, genreRes] = await Promise.all([
          API.get("/books"),
          API.get("/genres"),
        ]);
        setBooks(bookRes.data.data);
        setGenres(genreRes.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const keyword = search.toLowerCase();
  const filtered = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(keyword) ||
      book.author?.name.toLowerCase().includes(keyword);
    const matchGenre = genreFilter === "" || String(book.genre_id) === genreFilter;
    return matchSearch && matchGenre;
  });

  return (
    <>
      {/* Banner */}
      <section
        className="text-white"
        style={{
          background:
            "linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #818cf8 100%)",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Temukan Buku Favoritmu
          </h1>
          <p className="text-indigo-100 max-w-xl mx-auto">
            Jelajahi koleksi buku dari berbagai genre dan penulis, lalu beli
            dengan mudah.
          </p>
        </div>
      </section>

      {/* Daftar buku */}
      <section className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau penulis..."
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full sm:flex-1 p-2.5"
          />
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full sm:w-56 p-2.5"
          >
            <option value="">Semua genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-gray-500">Memuat buku...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <p className="text-gray-500">Buku tidak ditemukan.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}