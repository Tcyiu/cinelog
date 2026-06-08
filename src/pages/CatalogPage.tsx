import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, LayoutGrid, List, SearchX } from 'lucide-react'
import clsx from 'clsx'
import { mediaItems } from '../data'
import type { MediaType } from '../types'
import { Button, MediaCard, Badge } from '../components/ui'

const CatalogPage = () => {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title' | 'popularity'>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const allGenres = useMemo(
    () => Array.from(new Set(mediaItems.flatMap(item => item.genres))).sort(),
    []
  )

  const allYears = useMemo(
    () => Array.from(new Set(mediaItems.map(item => item.year))).sort((a, b) => b - a),
    []
  )

  const filteredItems = useMemo(() => {
    let result = [...mediaItems]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          (item.originalTitle?.toLowerCase().includes(q) ?? false)
      )
    }

    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType)
    }

    if (selectedGenre !== 'all') {
      result = result.filter(item => item.genres.includes(selectedGenre))
    }

    if (selectedYear !== 'all') {
      result = result.filter(item => item.year === Number(selectedYear))
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.averageRating - a.averageRating)
        break
      case 'popularity':
        result.sort((a, b) => b.ratingsCount - a.ratingsCount)
        break
      case 'year':
        result.sort((a, b) => b.year - a.year)
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [search, selectedType, selectedGenre, selectedYear, sortBy])

  const resetFilters = () => {
    setSearch('')
    setSelectedType('all')
    setSelectedGenre('all')
    setSelectedYear('all')
    setSortBy('rating')
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <div className="bg-dark-surface/30 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-1">Catalog</h1>
          <p className="text-dark-muted">
            Browse {mediaItems.length} titles across all categories
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search titles..."
              className="w-full bg-dark-surface border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Select */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as MediaType | 'all')}
            className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="anime">Anime</option>
            <option value="cartoon">Cartoon</option>
            <option value="web-series">Web Series</option>
          </select>

          {/* Genre Select */}
          <select
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Genres</option>
            {allGenres.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Years</option>
            {allYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
          >
            <option value="rating">Top Rated</option>
            <option value="popularity">Most Popular</option>
            <option value="year">Newest</option>
            <option value="title">A–Z</option>
          </select>

          {/* Reset Button */}
          {(search ||
            selectedType !== 'all' ||
            selectedGenre !== 'all' ||
            selectedYear !== 'all') && (
            <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<X className="w-4 h-4" />}>
              Reset
            </Button>
          )}

          {/* View Mode Toggle */}
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-brand-500 text-white'
                  : 'text-dark-muted hover:text-white hover:bg-dark-surface'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-brand-500 text-white'
                  : 'text-dark-muted hover:text-white hover:bg-dark-surface'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Count */}
        <p className="text-dark-muted mb-6">
          {filteredItems.length} {filteredItems.length === 1 ? 'title' : 'titles'} found
        </p>

        {/* Grid View */}
        {viewMode === 'grid' && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredItems.length > 0 && (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <Link
                key={item.id}
                to={`/title/${item.id}`}
                className="flex gap-4 bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-brand-500 transition-colors group"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-24 h-32 object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm text-dark-muted">{item.year}</span>
                      {item.genres.slice(0, 3).map(g => (
                        <Badge key={g} label={g} variant="genre" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-dark-muted line-clamp-2">{item.synopsis}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchX className="w-16 h-16 text-dark-muted mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No titles found</h2>
            <p className="text-dark-muted mb-6">Try adjusting your filters or search query</p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage
