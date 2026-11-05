import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/public";
import AdminLayout from "./layouts/admin";
import Home from "./pages/public/index";
import Dashboard from "./pages/admin/index";
import AdminGenres from "./pages/admin/genres/index";
import Login from "./pages/auth/login";
import GenreCreate from "./pages/admin/genres/create";
import AdminAuthors from "./pages/admin/authors/index";
import AuthorCreate from "./pages/admin/authors/create";
import AdminBooks from "./pages/admin/books/index";
import BookCreate from "./pages/admin/books/create";
import BookEdit from "./pages/admin/books/edit";
import GenreEdit from "./pages/admin/genres/edit";
import AuthorEdit from "./pages/admin/authors/edit";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="genres" element={<AdminGenres />} />
      <Route path="genres/create" element={<GenreCreate />} />
      <Route path="authors" element={<AdminAuthors />} />
      <Route path="authors/create" element={<AuthorCreate />} />
      <Route path="books" element={<AdminBooks />} />
      <Route path="books/create" element={<BookCreate />} />
      <Route path="books/:id/edit" element={<BookEdit />} />
      <Route path="genres/:id/edit" element={<GenreEdit />} />
      <Route path="authors/:id/edit" element={<AuthorEdit />} />
      </Route>
    </Routes>
  );
}