import { useNavigate } from 'react-router-dom'
import { Play, TrendingUp, Award, Clock } from 'lucide-react'
import { mediaItems, fakeUsers, fakeReviews } from '../data'
import { Button, Badge, Rating, MediaCard } from '../components/ui'

const HomePage = () => {
  const navigate = useNavigate()

  // Calculate items based on media data safely (no compile-time fields errors)
  const trendingItems = [...mediaItems]
    .sort((a, b) => b.ratingsCount - a.ratingsCount)
    .slice(0, 10)

  const topRatedItems = [...mediaItems]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 8)

  // Sort by year desc, then by id desc (since releaseDate is not present in types)
  const getNumericId = (id: string) => parseInt(id.replace('title-', ''), 10) || 0
  const recentItems = [...mediaItems]
    .sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year
      }
      return getNumericId(b.id) - getNumericId(a.id)
    })
    .slice(0, 8)

  const heroItem = mediaItems[0]

  return (
    <div className="flex-1 bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      {/* Section 1: Hero */}
      {heroItem && (
        <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
          {/* Background image */}
          {heroItem.bannerUrl && (
            <img
              src={heroItem.bannerUrl}
              alt={heroItem.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent dark:from-dark-bg dark:via-dark-bg/60 dark:to-transparent transition-colors duration-200" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-dark-bg/80 dark:to-transparent transition-colors duration-200" />
          
          {/* Content overlay */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12 w-full">
            <Badge label={heroItem.type} variant="type" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mt-3 mb-3 max-w-2xl leading-tight">
              {heroItem.title}
            </h1>
            <p className="text-gray-600 dark:text-dark-muted text-base md:text-lg max-w-xl mb-6 line-clamp-2">
              {heroItem.synopsis}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Rating
                value={heroItem.averageRating}
                count={heroItem.ratingsCount}
                size="lg"
              />
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="w-5 h-5 fill-current" />}
                onClick={() => navigate(`/title/${heroItem.id}`)}
              >
                View Details
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/catalog')}
              >
                Browse All
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Trending Now */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Trending Now
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
          >
            View all &rarr;
          </button>
        </div>

        {/* Horizontal scrollable row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
          {trendingItems.map((item) => (
            <div key={item.id} className="flex-none w-36 md:w-44">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Top Rated */}
      <div className="bg-gray-100/50 dark:bg-dark-surface/30 py-10 transition-colors duration-200">
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Rated
              </h2>
            </div>
            <button
              onClick={() => navigate('/top')}
              className="text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
            >
              View all &rarr;
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {topRatedItems.map((item, index) => (
              <MediaCard key={item.id} item={item} rank={index + 1} />
            ))}
          </div>
        </section>
      </div>

      {/* Section 4: Recently Added */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recently Added
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
          >
            View all &rarr;
          </button>
        </div>

        {/* Horizontal scrollable row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
          {recentItems.map((item) => (
            <div key={item.id} className="flex-none w-36 md:w-44">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm transition-colors duration-200">
          <div>
            <p className="text-3xl font-bold text-brand-500">
              {mediaItems.length}
            </p>
            <p className="text-dark-muted text-sm mt-1">Titles</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-brand-500">5</p>
            <p className="text-dark-muted text-sm mt-1">Media Types</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-brand-500">
              {fakeUsers.length}+
            </p>
            <p className="text-dark-muted text-sm mt-1">Active Users</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-brand-500">
              {fakeReviews.length}+
            </p>
            <p className="text-dark-muted text-sm mt-1">Reviews</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
