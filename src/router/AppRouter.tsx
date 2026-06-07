import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import CatalogPage from '../pages/CatalogPage'
import ComparePage from '../pages/ComparePage'
import HomePage from '../pages/HomePage'
import ListPage from '../pages/ListPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import SearchPage from '../pages/SearchPage'
import TitlePage from '../pages/TitlePage'
import TopPage from '../pages/TopPage'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'

const AppRouter = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/top" element={<TopPage />} />
      <Route path="/title/:id" element={<TitlePage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/list" element={<ListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AuthProvider>
)

export default AppRouter
