import { useState } from "react";
import { coverUrl } from "../utils/helpers";

export default function BookCover({ filename, title, className = "" }) {
  const [failed, setFailed] = useState(false);

  // Kalau cover tidak ada atau gagal dimuat, tampilkan kotak ungu berinisial
  if (!filename || failed) {
    return (
      <div
        className={`flex items-center justify-center text-white font-bold ${className}`}
        style={{ background: "linear-gradient(135deg, #4f46e5, #a78bfa)" }}
      >
        <span className="text-5xl">{title?.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={coverUrl(filename)}
      alt={title}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}