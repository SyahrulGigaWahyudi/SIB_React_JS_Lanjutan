import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../_api";

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <section className="p-3 sm:p-5">
      <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-gray-900">Genres</h2>
          <Link
            to="/admin/genres/create"
            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2"
          >
            + Add genre
          </Link>
        </div>

        {loading && <p className="p-4 text-gray-500">Memuat data...</p>}
        {error && <p className="p-4 text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr key={genre.id} className="border-b">
                    <td className="px-4 py-3">{genre.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {genre.name}
                    </td>
                    <td className="px-4 py-3">{genre.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}