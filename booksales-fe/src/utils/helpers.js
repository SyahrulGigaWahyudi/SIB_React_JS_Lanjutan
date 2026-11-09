const SERVER_URL = "http://127.0.0.1:8000";

export const coverUrl = (filename) => `${SERVER_URL}/storage/books/${filename}`;

export const formatRupiah = (value) =>
  "Rp " + Number(value).toLocaleString("id-ID");