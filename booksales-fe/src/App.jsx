import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/public";
import AdminLayout from "./layouts/admin";
import ProtectedRoute from "./components/protectedroute";

import Home from "./pages/public/index";
import BookDetail from "./pages/public/bookdetail";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import Dashboard from "./pages/admin/index";
import AdminGenres from "./pages/admin/genres/index";
import GenreCreate from "./pages/admin/genres/create";
import GenreEdit from "./pages/admin/genres/edit";
import AdminAuthors from "./pages/admin/authors/index";
import AuthorCreate from "./pages/admin/authors/create";
import AuthorEdit from "./pages/admin/authors/edit";
import AdminBooks from "./pages/admin/books/index";
import BookCreate from "./pages/admin/books/create";
import BookEdit from "./pages/admin/books/edit";

export default function App() {
  return (
    <Routes>
      {/* Publik: bisa diakses semua orang */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Khusus admin: user biasa dan tamu otomatis dialihkan */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="genres" element={<AdminGenres />} />
          <Route path="genres/create" element={<GenreCreate />} />
          <Route path="genres/:id/edit" element={<GenreEdit />} />

          <Route path="authors" element={<AdminAuthors />} />
          <Route path="authors/create" element={<AuthorCreate />} />
          <Route path="authors/:id/edit" element={<AuthorEdit />} />

          <Route path="books" element={<AdminBooks />} />
          <Route path="books/create" element={<BookCreate />} />
          <Route path="books/:id/edit" element={<BookEdit />} />
        </Route>
      </Route>

      {/* Alamat yang tidak dikenal kembali ke beranda */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}