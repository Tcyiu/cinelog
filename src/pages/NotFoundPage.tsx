import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center px-4 text-center">
    <div>
      <div className="text-8xl font-bold text-brand-500">404</div>
      <h1 className="mt-6 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        className="mt-8 inline-flex rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-600"
        to="/"
      >
        Go Home
      </Link>
    </div>
  </main>
)

export default NotFoundPage
