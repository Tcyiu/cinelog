import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import clsx from 'clsx'
import { mediaItems } from '../data'
import type { MediaType } from '../types'
import { Badge, Rating } from '../components/ui'
import { getItemCommunityRating } from '../utils/ratings'
import usePageTitle from '../hooks/usePageTitle'

const TopPage = () => {
  usePageTitle('Top Rated')

  const [filterType, setFilterType] = useState<MediaType | 'all'>('all')

  const rankedItems = useMemo(() => {
    let items = [...mediaItems]
    if (filterType !== 'all') items = items.filter(i => i.type === filterType)
    return items.sort((a, b) => getItemCommunityRating(b) - getItemCommunityRating(a))
  }, [filterType])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      <div className="bg-gray-50 dark:bg-dark-surface/30 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-7 h-7 text-brand-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Top Rated</h1>
          </div>
          <p className="text-gray-600 dark:text-dark-muted">Best titles ranked by community rating</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-2 flex-wrap">
        {(['all', 'movie', 'series', 'anime', 'cartoon', 'web-series'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
              filterType === type
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {type === 'all' ? 'All' : type}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {rankedItems.length >= 3 && filterType === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {rankedItems.slice(0, 3).map((item, index) => {
              const medals = ['🥇', '🥈', '🥉']
              const medalColors = [
                'border-yellow-400 shadow-yellow-400/20',
                'border-gray-400 shadow-gray-400/20',
                'border-orange-400 shadow-orange-400/20',
              ]
              const rating = getItemCommunityRating(item)

              return (
                <Link
                  key={item.id}
                  to={`/title/${item.id}`}
                  className={clsx(
                    'bg-white dark:bg-dark-card border-2 rounded-2xl p-4 flex gap-4 hover:opacity-90 transition-opacity shadow-lg',
                    medalColors[index]
                  )}
                >
                  <div className="relative flex-none">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded-xl"
                    />
                    <span className="absolute -top-2 -left-2 text-2xl">{medals[index]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">{item.title}</p>
                    <Rating value={rating} count={item.ratingsCount} size="sm" />
                    <div className="mt-2">
                      <Badge label={item.type} variant="type" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {rankedItems.slice(filterType === 'all' ? 3 : 0).map((item, index) => {
            const rank = filterType === 'all' ? index + 4 : index + 1
            const rating = getItemCommunityRating(item)

            return (
              <Link
                key={item.id}
                to={`/title/${item.id}`}
                className="flex items-center gap-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 hover:border-brand-500/50 transition-colors group"
              >
                <span className="text-gray-500 dark:text-dark-muted font-bold text-lg w-8 text-center flex-none">
                  #{rank}
                </span>
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-10 h-14 object-cover rounded-lg flex-none"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <Badge label={item.type} variant="type" />
                    <span className="text-gray-600 dark:text-dark-muted text-xs">{item.year}</span>
                  </div>
                </div>
                <Rating value={rating} count={item.ratingsCount} size="sm" />
              </Link>
            )
          })}
        </div>

        {rankedItems.length === 0 && (
          <div className="text-center py-16 text-gray-600 dark:text-dark-muted">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No titles found for this type</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopPage
