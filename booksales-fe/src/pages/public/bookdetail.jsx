import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../_api";
import BookCover from "../../components/bookcover";
import { useAuth } from "../../context/authcontext";
import { formatRupiah } from "../../utils/helpers";

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await API.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Buku tidak ditemukan.");
        } else {
          setError("Gagal mengambil data buku.");
        }
      } finally {
        setLoading(false);
      }
    };

    getBook();
  }, [id]);

  const changeQuantity = (value) => {
    const next = Math.max(1, Math.min(book.stock, Number(value) || 1));
    setQuantity(next);
  };

  const handleBuy = async () => {
    // Belum login: arahkan ke login, lalu kembali ke halaman ini
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setNotice(null);
    setBuying(true);

    try {
      const response = await API.post("/transactions", {
        book_id: book.id,
        quantity: Number(quantity),
      });
      const transaction = response.data.data;

      setBook({ ...book, stock: book.stock - Number(quantity) });
      setQuantity(1);
      setNotice({
        type: "success",
        text: `Pembelian berhasil! Nomor order ${transaction.order_number}, total ${formatRupiah(transaction.total_amount)}.`,
      });
    } catch (err) {
      const status = err.response?.status;
      let text = "Terjadi kesalahan, coba lagi.";

      if (status === 400) {
        text = err.response.data.message;
      } else if (status === 403) {
        text = "Hanya akun customer yang dapat membeli buku.";
      } else if (status === 422) {
        text = "Jumlah pembelian tidak valid.";
      }

      setNotice({ type: "error", text });
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <p className="max-w-screen-xl mx-auto px-4 py-10 text-gray-500">Memuat data...</p>;
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const soldOut = book.stock <= 0;
  const isAdmin = user?.role === "admin";

  // Teks dan status tombol sesuai kondisi pengguna
  let buttonLabel = "Beli sekarang";
  let buttonDisabled = false;

  if (soldOut) {
    buttonLabel = "Stok habis";
    buttonDisabled = true;
  } else if (!user) {
    buttonLabel = "Masuk untuk membeli";
  } else if (isAdmin) {
    buttonLabel = "Akun admin tidak dapat membeli";
    buttonDisabled = true;
  } else if (buying) {
    buttonLabel = "Memproses...";
    buttonDisabled = true;
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <Link
        to={isAdmin ? "/admin" : "/"}
        className="text-sm text-indigo-600 hover:underline"
      >
        &larr; {isAdmin ? "Kembali ke dashboard" : "Kembali ke beranda"}
      </Link>

      <div className="mt-4 bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <BookCover
          filename={book.cover_photo}
          title={book.title}
          className="w-full h-80 md:h-full min-h-80"
        />

        <div className="p-6 sm:p-8">
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full px-3 py-1">
            {book.genre?.name}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-500 mt-1">oleh {book.author?.name}</p>

          <p className="mt-4 text-3xl font-bold text-indigo-700">
            {formatRupiah(book.price)}
          </p>
          <p className={`mt-1 text-sm ${soldOut ? "text-red-600" : "text-gray-500"}`}>
            {soldOut ? "Stok habis" : `Stok tersedia: ${book.stock}`}
          </p>

          <h2 className="mt-6 font-semibold text-gray-900">Deskripsi</h2>
          <p className="mt-1 text-gray-600 leading-relaxed">{book.description}</p>

          {!soldOut && !isAdmin && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Jumlah</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeQuantity(quantity - 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 text-lg"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => changeQuantity(e.target.value)}
                  className="w-20 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                />
                <button
                  type="button"
                  onClick={() => changeQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 text-lg"
                >
                  +
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Total:{" "}
                <span className="font-bold text-indigo-700">
                  {formatRupiah(book.price * quantity)}
                </span>
              </p>
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={buttonDisabled}
            className="mt-6 w-full text-white bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-3 shadow-md"
          >
            {buttonLabel}
          </button>

          {notice && (
            <p
              className={`mt-4 text-sm rounded-lg px-3 py-2 ${
                notice.type === "success"
                  ? "text-green-700 bg-green-50"
                  : "text-red-600 bg-red-50"
              }`}
            >
              {notice.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}