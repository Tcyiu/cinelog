import { Link } from 'react-router-dom'
import type { MediaItem } from '../../types'
import Badge from './Badge'
import Rating from './Rating'

export interface MediaCardProps {
  item: MediaItem
  rank?: number
}

const MediaCard = ({ item, rank }: MediaCardProps) => {
  return (
    <Link to={`/title/${item.id}`} className="block">
      <div className="group relative dark:bg-dark-card bg-white rounded-xl overflow-hidden border dark:border-dark-border border-gray-200 hover:border-brand-500 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-1">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-dark-surface">
          <img
            src={item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <Rating value={item.averageRating} size="sm" />
          </div>

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 z-10">
            <Badge label={item.type} variant="type" />
          </div>

          {/* Rank Badge if specified */}
          {rank !== undefined && (
            <div className="absolute top-2 right-2 z-10 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md border border-white/10">
              #{rank}
            </div>
          )}
        </div>

        {/* Info below poster */}
        <div className="p-3 dark:bg-dark-card bg-gray-100">
          <h3 className="font-semibold text-sm dark:text-gray-200 text-gray-900 line-clamp-1 group-hover:text-brand-500 transition-colors">
            {item.title}
          </h3>
          <p className="dark:text-dark-muted text-gray-600 text-xs mt-1">{item.year}</p>
        </div>
      </div>
    </Link>
  )
}

export default MediaCard
