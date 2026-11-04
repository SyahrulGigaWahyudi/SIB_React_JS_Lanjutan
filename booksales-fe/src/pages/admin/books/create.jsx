import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../_api";
import BookForm from "../../../components/bookform";

export default function BookCreate() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      await API.post("/books", formData);
      navigate("/admin/books");
    } catch (err) {
      const status = err.response?.status;

      if (status === 422) {
        setErrors(err.response.data.message);
      } else if (status === 401) {
        setMessage("Belum login atau sesi habis. Silakan login lagi.");
      } else if (status === 403) {
        setMessage("Akun ini bukan admin, tidak boleh menambah data.");
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Book
        </h2>
        <BookForm
          onSubmit={handleSubmit}
          submitLabel="Create Book"
          errors={errors}
          message={message}
          loading={loading}
        />
      </div>
    </section>
  );
}