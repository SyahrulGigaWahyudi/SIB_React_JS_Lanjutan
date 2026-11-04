import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../_api";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5";
const labelClass = "block mb-2 text-sm font-medium text-gray-900";

export default function BookForm({
  initial,
  onSubmit,
  submitLabel,
  errors = {},
  message = "",
  loading = false,
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [genreId, setGenreId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Ambil daftar genre dan author untuk pilihan dropdown
  useEffect(() => {
    const getOptions = async () => {
      try {
        const [genreRes, authorRes] = await Promise.all([
          API.get("/genres"),
          API.get("/authors"),
        ]);
        setGenres(genreRes.data.data);
        setAuthors(authorRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    getOptions();
  }, []);

  // Mode edit: isi form dengan data buku yang sudah ada
  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setPrice(initial.price);
      setStock(initial.stock);
      setGenreId(String(initial.genre_id));
      setAuthorId(String(initial.author_id));
      setDescription(initial.description);
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // File gambar harus dikirim sebagai FormData, bukan JSON biasa
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("genre_id", genreId);
    formData.append("author_id", authorId);
    formData.append("description", description);
    if (cover) {
      formData.append("cover_photo", cover);
    }

    onSubmit(formData);
  };

  const handleReset = () => {
    setTitle(initial?.title ?? "");
    setPrice(initial?.price ?? "");
    setStock(initial?.stock ?? "");
    setGenreId(initial ? String(initial.genre_id) : "");
    setAuthorId(initial ? String(initial.author_id) : "");
    setDescription(initial?.description ?? "");
    setCover(null);
    setFileKey((key) => key + 1); // mengosongkan input file
  };

  const fieldError = (field) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{errors[field][0]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book Title"
          className={inputClass}
        />
        {fieldError("title")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className={labelClass}>Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 150000"
            className={inputClass}
          />
          {fieldError("price")}
        </div>
        <div>
          <label htmlFor="stock" className={labelClass}>Stock</label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="e.g. 20"
            className={inputClass}
          />
          {fieldError("stock")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="genre" className={labelClass}>Genre</label>
          <select
            id="genre"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className={inputClass}
          >
            <option value="">--select genre--</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {fieldError("genre_id")}
        </div>
        <div>
          <label htmlFor="author" className={labelClass}>Author</label>
          <select
            id="author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className={inputClass}
          >
            <option value="">--select author--</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          {fieldError("author_id")}
        </div>
      </div>

      <div>
        <label htmlFor="cover" className={labelClass}>Cover Photo</label>
        <input
          key={fileKey}
          id="cover"
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files[0])}
          className={inputClass}
        />
        {initial?.cover_photo && (
          <p className="mt-1 text-xs text-gray-500">
            Cover saat ini: {initial.cover_photo} (kosongkan jika tidak ingin mengganti)
          </p>
        )}
        {fieldError("cover_photo")}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a description of the book..."
          className={inputClass}
        />
        {fieldError("description")}
      </div>

      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          {loading ? "Menyimpan..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Reset
        </button>
        <Link
          to="/admin/books"
          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}