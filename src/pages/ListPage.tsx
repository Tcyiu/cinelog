import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Trash2, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { mediaItems } from '../data'
import type { MediaItem, UserListEntry, WatchStatus } from '../types'
import { Button, Badge } from '../components/ui'
import { getUserList, addOrUpdateEntry, removeEntry } from '../utils/storage'
import usePageTitle from '../hooks/usePageTitle'

const ListPage = () => {
  usePageTitle('My List')

  const { user } = useAuth()
  const navigate = useNavigate()

  const [entries, setEntries] = useState<UserListEntry[]>(() => getUserList())
  const [activeTab, setActiveTab] = useState<WatchStatus | 'all'>('all')
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())

  const enrichedEntries = useMemo(
    () =>
      entries
        .map(entry => ({
          entry,
          item: mediaItems.find(m => m.id === entry.titleId),
        }))
        .filter((e): e is { entry: UserListEntry; item: MediaItem } => e.item !== undefined),
    [entries]
  )

  const statusLabels: Record<WatchStatus, string> = {
    watching: 'Watching',
    completed: 'Completed',
    plan_to_watch: 'Plan to Watch',
    dropped: 'Dropped',
    on_hold: 'On Hold',
  }

  const statusColors: Record<WatchStatus, string> = {
    watching: 'text-brand-600 dark:text-white',
    completed: 'text-green-600 dark:text-green-400',
    plan_to_watch: 'text-yellow-600 dark:text-yellow-400',
    dropped: 'text-red-600 dark:text-red-400',
    on_hold: 'text-orange-600 dark:text-orange-400',
  }

  const tabs: { value: WatchStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'watching', label: 'Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'plan_to_watch', label: 'Plan to Watch' },
    { value: 'dropped', label: 'Dropped' },
    { value: 'on_hold', label: 'On Hold' },
  ]

  const filteredEntries = useMemo(
    () =>
      activeTab === 'all'
        ? enrichedEntries
        : enrichedEntries.filter(e => e.entry.status === activeTab),
    [enrichedEntries, activeTab]
  )

  const handleStatusChange = (titleId: string, status: WatchStatus) => {
    const entry = entries.find(e => e.titleId === titleId)
    if (!entry) return
    const updated = {
      ...entry,
      status,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    addOrUpdateEntry(updated)
    setEntries(getUserList())
    closeDropdown(titleId)
  }

  const handleRatingChange = (titleId: string, rating: number) => {
    const entry = entries.find(e => e.titleId === titleId)
    if (!entry) return

    const updatedAt = new Date().toISOString().split('T')[0]

    if (entry.userRating === rating) {
      const { userRating: _, ...rest } = entry
      addOrUpdateEntry({ ...rest, updatedAt })
    } else {
      addOrUpdateEntry({ ...entry, userRating: rating, updatedAt })
    }

    setEntries(getUserList())
  }

  const handleRemove = (titleId: string) => {
    removeEntry(titleId)
    setEntries(getUserList())
  }

  const toggleDropdown = (titleId: string) => {
    setOpenDropdowns(prev => {
      const next = new Set(prev)
      if (next.has(titleId)) {
        next.delete(titleId)
      } else {
        next.add(titleId)
      }
      return next
    })
  }

  const closeDropdown = (titleId: string) => {
    setOpenDropdowns(prev => {
      const next = new Set(prev)
      next.delete(titleId)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-dark-surface/30 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.avatarUrl}
              alt={user?.username}
              className="w-12 h-12 rounded-full border-2 border-brand-500 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.username}'s List
              </h1>
              <p className="text-gray-600 dark:text-dark-muted text-sm">
                {enrichedEntries.length} titles in your list
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 flex-wrap">
            {(Object.keys(statusLabels) as WatchStatus[]).map(status => {
              const count = enrichedEntries.filter(e => e.entry.status === status).length
              return (
                <div key={status} className="text-center">
                  <div className={clsx('text-xl font-bold', statusColors[status])}>
                    {count}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-dark-muted">
                    {statusLabels[status]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map(tab => {
              const count =
                tab.value === 'all'
                  ? enrichedEntries.length
                  : enrichedEntries.filter(e => e.entry.status === tab.value).length
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={clsx(
                    'flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    activeTab === tab.value
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-surface'
                  )}
                >
                  {tab.label}
                  <span
                    className={clsx('ml-1.5 text-xs', activeTab === tab.value ? 'text-white/70' : 'text-gray-500 dark:text-dark-muted')}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Empty State — List is empty */}
        {enrichedEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-dark-muted" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your list is empty
            </h3>
            <p className="text-gray-600 dark:text-dark-muted max-w-sm">
              Start adding titles from the catalog to track what you watch
            </p>
            <Button variant="primary" onClick={() => navigate('/catalog')}>
              Browse Catalog
            </Button>
          </div>
        )}

        {/* Empty State — Tab has no entries */}
        {enrichedEntries.length > 0 && filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-gray-600 dark:text-dark-muted">
              No titles with status "{statusLabels[activeTab as WatchStatus]}"
            </p>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('all')}>
              Show All
            </Button>
          </div>
        )}

        {/* List */}
        {filteredEntries.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredEntries.map(({ entry, item }) => (
              <div
                key={entry.titleId}
                className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 flex gap-4 group hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-colors"
              >
                {/* Poster */}
                <Link to={`/title/${item.id}`} className="flex-none">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-16 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <Link to={`/title/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => handleRemove(entry.titleId)}
                      className="text-gray-500 dark:text-dark-muted hover:text-red-400 dark:hover:text-red-400 transition-colors flex-none"
                      title="Remove from list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge label={item.type} variant="type" />
                    <span className="text-gray-600 dark:text-dark-muted text-xs">{item.year}</span>
                    {item.episodes && (
                      <span className="text-gray-600 dark:text-dark-muted text-xs">
                        {item.episodes} ep.
                      </span>
                    )}
                  </div>

                  {/* Status and Rating Controls */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {/* Status Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(entry.titleId)}
                        className={clsx(
                          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors pr-2.5',
                          'bg-gray-100 dark:bg-dark-surface border border-gray-300 dark:border-dark-border focus:outline-none focus:border-brand-500',
                          statusColors[entry.status]
                        )}
                      >
                        {statusLabels[entry.status]}
                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                      </button>

                      {openDropdowns.has(entry.titleId) && (
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-20 min-w-[150px] overflow-hidden">
                          {(Object.keys(statusLabels) as WatchStatus[]).map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(entry.titleId, status)}
                              className={clsx(
                                'w-full text-left px-3 py-2 text-xs transition-colors',
                                'hover:bg-gray-100 dark:hover:bg-dark-surface',
                                entry.status === status
                                  ? 'bg-gray-100 dark:bg-dark-surface font-semibold'
                                  : '',
                                statusColors[status]
                              )}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5">
                      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => handleRatingChange(entry.titleId, n)}
                            title={
                              entry.userRating === n
                                ? 'Click to remove rating'
                                : `Rate ${n}/10`
                            }
                            className={clsx(
                              'text-lg transition-transform hover:scale-110 select-none flex-none',
                              n <= (entry.userRating ?? 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-dark-border hover:text-yellow-400/50 dark:hover:text-yellow-400/50'
                            )}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      {entry.userRating !== undefined && (
                        <>
                          <span className="ml-1 text-gray-900 dark:text-white text-xs font-medium flex-none">
                            {entry.userRating}/10
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRatingChange(entry.titleId, entry.userRating!)}
                            className="text-gray-500 dark:text-dark-muted hover:text-red-400 dark:hover:text-red-400 text-xs flex-none transition-colors"
                            title="Remove rating"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-dark-muted text-xs mt-2">
                    Added {entry.addedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ListPage
