import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../_api";
import BookForm from "../../../components/bookform";

export default function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await API.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (err) {
        console.error(err);
        setMessage("Buku tidak ditemukan.");
      }
    };
    getBook();
  }, [id]);

  const handleSubmit = async (formData) => {
    setErrors({});
    setMessage("");
    setLoading(true);

    // Laravel membaca file lewat POST, jadi method PUT disamarkan lewat _method
    formData.append("_method", "PUT");

    try {
      await API.post(`/books/${id}`, formData);
      navigate("/admin/books");
    } catch (err) {
      const status = err.response?.status;

      if (status === 422) {
        setErrors(err.response.data.message);
      } else if (status === 401) {
        setMessage("Belum login atau sesi habis. Silakan login lagi.");
      } else if (status === 403) {
        setMessage("Akun ini bukan admin, tidak boleh mengubah data.");
      } else if (status === 404) {
        setMessage("Buku tidak ditemukan.");
      } else {
        setMessage("Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-3 sm:p-5">
      <div className="bg-white shadow-md sm:rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Book</h2>
        {book ? (
          <BookForm
            initial={book}
            onSubmit={handleSubmit}
            submitLabel="Update Book"
            errors={errors}
            message={message}
            loading={loading}
          />
        ) : (
          <p className="text-gray-500">{message || "Memuat data..."}</p>
        )}
      </div>
    </section>
  );
}