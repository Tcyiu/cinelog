import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { List, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { mediaItems } from '../data'
import type { MediaItem, MediaType, UserListEntry } from '../types'
import { Button, Rating } from '../components/ui'
import { getUserList } from '../utils/storage'
import { countUserReviews } from '../utils/userStats'
import usePageTitle from '../hooks/usePageTitle'

const ProfilePage = () => {
  usePageTitle('Profile')

  const { user } = useAuth()
  const navigate = useNavigate()

  const userList = getUserList()

  const totalWatched = userList.filter(e => e.status === 'completed').length
  const totalInList = userList.length
  const reviewCount = countUserReviews(userList)

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    userList.forEach(entry => {
      const item = mediaItems.find(m => m.id === entry.titleId)
      if (item) counts[item.type] = (counts[item.type] ?? 0) + 1
    })
    return counts
  }, [userList])

  const favoriteGenre = useMemo(() => {
    const completed = userList.filter(e => e.status === 'completed')
    const genreCounts: Record<string, number> = {}
    completed.forEach(entry => {
      const item = mediaItems.find(m => m.id === entry.titleId)
      item?.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] ?? 0) + 1
      })
    })
    const sorted = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] ?? '—'
  }, [userList])

  const recentEntries = useMemo(
    () =>
      [...userList]
        .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
        .slice(0, 5)
        .map(entry => ({ entry, item: mediaItems.find(m => m.id === entry.titleId) }))
        .filter((e): e is { entry: UserListEntry; item: MediaItem } => e.item !== undefined),
    [userList]
  )

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      <div className="bg-gray-50 dark:bg-dark-surface/30 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user?.avatarUrl}
              alt={user?.username}
              className="w-24 h-24 rounded-full border-4 border-brand-500 shadow-lg shadow-brand-500/20"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.username}</h1>
              <p className="text-gray-600 dark:text-dark-muted mt-1">Member of CineLog</p>
              <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/list')}
                  leftIcon={<List className="w-4 h-4" />}
                >
                  My List
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/compare')}
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-brand-500">{totalInList}</p>
            <p className="text-gray-600 dark:text-dark-muted text-sm mt-1">In List</p>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-green-400">{totalWatched}</p>
            <p className="text-gray-600 dark:text-dark-muted text-sm mt-1">Completed</p>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">{reviewCount}</p>
            <p className="text-gray-600 dark:text-dark-muted text-sm mt-1">Reviews</p>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-purple-400">{favoriteGenre}</p>
            <p className="text-gray-600 dark:text-dark-muted text-sm mt-1">Fav Genre</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">By Media Type</h2>
          <div className="space-y-3">
            {(['movie', 'series', 'anime', 'cartoon', 'web-series'] as MediaType[]).map(type => {
              const count = typeCounts[type] ?? 0
              const max = Math.max(...Object.values(typeCounts), 1)
              const pct = Math.round((count / max) * 100)

              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-dark-muted text-sm capitalize w-20 flex-none">
                    {type}
                  </span>
                  <div className="flex-1 bg-gray-100 dark:bg-dark-surface rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-gray-900 dark:text-white text-sm font-medium w-6 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recently Added</h2>
            <button
              onClick={() => navigate('/list')}
              className="text-brand-500 hover:text-brand-600 text-sm transition-colors"
            >
              View all →
            </button>
          </div>

          {recentEntries.length === 0 && (
            <p className="text-gray-600 dark:text-dark-muted text-sm text-center py-4">Nothing added yet</p>
          )}

          <div className="flex flex-col gap-3">
            {recentEntries.map(({ entry, item }) => (
              <Link
                key={entry.titleId}
                to={`/title/${item.id}`}
                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-surface rounded-xl p-2 transition-colors group"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-10 h-14 object-cover rounded-lg flex-none"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white text-sm font-medium group-hover:text-brand-500 transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-gray-600 dark:text-dark-muted text-xs mt-0.5">{entry.addedAt}</p>
                </div>
                {entry.userRating && <Rating value={entry.userRating} size="sm" />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
