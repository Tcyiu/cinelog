import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SearchX } from 'lucide-react'
import { mediaItems } from '../data'
import { MediaCard } from '../components/ui'
import usePageTitle from '../hooks/usePageTitle'

const SearchPage = () => {
  usePageTitle('Search')

  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const setQuery = (value: string) => {
    if (value.trim()) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return mediaItems.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        (item.originalTitle?.toLowerCase().includes(q) ?? false) ||
        item.genres.some(genre => genre.toLowerCase().includes(q))
    )
  }, [query])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      {/* Search Header */}
      <div className="bg-gray-50 dark:bg-dark-surface/30 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Search</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-dark-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, genre or tag..."
              className="w-full bg-gray-100 dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-xl pl-12 pr-12 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-500 text-base"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Empty state — no query */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-gray-400 dark:text-dark-muted mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start typing to search</h2>
            <p className="text-gray-600 dark:text-dark-muted">Search across all titles, genres and tags</p>
          </div>
        )}

        {/* Results found */}
        {query && results.length > 0 && (
          <>
            <p className="text-gray-600 dark:text-dark-muted mb-6">
              Found {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map(item => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchX className="w-16 h-16 text-gray-400 dark:text-dark-muted mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
            <p className="text-gray-600 dark:text-dark-muted">Nothing matched "{query}". Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
