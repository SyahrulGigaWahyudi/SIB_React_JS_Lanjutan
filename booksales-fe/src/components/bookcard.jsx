import { Link } from "react-router-dom";
import BookCover from "./bookcover";
import { formatRupiah } from "../utils/helpers";

export default function BookCard({ book }) {
  const soldOut = book.stock <= 0;

  return (
    <Link
      to={`/books/${book.id}`}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
    >
      <BookCover
        filename={book.cover_photo}
        title={book.title}
        className="w-full h-56"
      />

      <div className="p-4 flex flex-col flex-1">
        <span className="self-start text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5">
          {book.genre?.name}
        </span>
        <h3 className="mt-2 font-semibold text-gray-900 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500">{book.author?.name}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-bold text-indigo-700">
            {formatRupiah(book.price)}
          </span>
          <span className={`text-xs ${soldOut ? "text-red-600" : "text-gray-500"}`}>
            {soldOut ? "Stok habis" : `Stok ${book.stock}`}
          </span>
        </div>
      </div>
    </Link>
  );
}