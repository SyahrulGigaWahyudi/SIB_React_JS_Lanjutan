import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../_api";
import { useAuth } from "../../context/authcontext";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ books: 0, genres: 0, authors: 0 });

  useEffect(() => {
    const getCounts = async () => {
      try {
        const [books, genres, authors] = await Promise.all([
          API.get("/books"),
          API.get("/genres"),
          API.get("/authors"),
        ]);
        setCounts({
          books: books.data.data.length,
          genres: genres.data.data.length,
          authors: authors.data.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    getCounts();
  }, []);

  const cards = [
    { label: "Total Buku", value: counts.books, to: "/admin/books" },
    { label: "Total Genre", value: counts.genres, to: "/admin/genres" },
    { label: "Total Author", value: counts.authors, to: "/admin/authors" },
  ];

  return (
    <section className="p-3 sm:p-5">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-6">
        Selamat datang, {user?.name}. Kelola data toko buku dari sini.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border-l-4 border-indigo-600"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-indigo-700 mt-1">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}