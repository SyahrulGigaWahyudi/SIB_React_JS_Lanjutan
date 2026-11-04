import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../_api";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const response = await API.get("/authors");
        setAuthors(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data author.");
      } finally {
        setLoading(false);
      }
    };

    getAuthors();
  }, []);

  return (
    <section className="p-3 sm:p-5">
      <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-gray-900">Authors</h2>
          <Link
            to="/admin/authors/create"
            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2"
          >
            + Add author
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
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Bio</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id} className="border-b">
                    <td className="px-4 py-3">{author.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {author.name}
                    </td>
                    <td className="px-4 py-3">{author.photo}</td>
                    <td className="px-4 py-3">{author.bio}</td>
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