/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Plus, Check, ChevronDown, Trash2, LogIn, MessageSquare } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { mediaItems, fakeReviews } from '../data'
import type { WatchStatus, UserListEntry } from '../types'
import { Button, Badge, Rating } from '../components/ui'
import { getEntryByTitleId, addOrUpdateEntry, removeEntry } from '../utils/storage'

const TitlePage = () => {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const item = mediaItems.find(m => m.id === id)

  if (!item) return <Navigate to="/404" replace />

  const titleReviews = fakeReviews.filter(r => r.titleId === id)

  const [listEntry, setListEntry] = useState<UserListEntry | undefined>(
    () => getEntryByTitleId(id ?? '')
  )

  const [userRating, setUserRating] = useState<number>(listEntry?.userRating ?? 0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const statusButtonRef = useRef<HTMLButtonElement>(null)

  const allRatings = [item.averageRating, ...titleReviews.map(r => r.rating)]
  const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length

  const statusLabels: Record<WatchStatus, string> = {
    watching: 'Watching',
    completed: 'Completed',
    plan_to_watch: 'Plan to Watch',
    dropped: 'Dropped',
    on_hold: 'On Hold',
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownOpen &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [statusDropdownOpen])

  const handleAddToList = () => {
    const entry: UserListEntry = {
      titleId: item.id,
      status: 'plan_to_watch',
      addedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    addOrUpdateEntry(entry)
    setListEntry(entry)
  }

  const handleStatusChange = (status: WatchStatus) => {
    const updated: UserListEntry = {
      ...listEntry!,
      status,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    addOrUpdateEntry(updated)
    setListEntry(updated)
    setStatusDropdownOpen(false)
  }

  const handleRemoveFromList = () => {
    removeEntry(item.id)
    setListEntry(undefined)
    setReviewSubmitted(false)
  }

  const handleSubmitReview = () => {
    if (!user || userRating === 0) return

    const updated: UserListEntry = {
      ...listEntry!,
      userRating,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    addOrUpdateEntry(updated)
    setListEntry(updated)
    setReviewSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      {/* Hero Banner */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img
          src={item.bannerUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-bg via-transparent to-transparent dark:via-dark-bg/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 dark:from-dark-bg/70 to-transparent" />
      </div>

      {/* Main Info Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-none">
            <img
              src={item.posterUrl}
              alt={item.title}
              className="w-48 h-72 md:w-56 md:h-80 object-cover rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-dark-border"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-32 md:pt-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge label={item.type} variant="type" />
              <Badge label={item.status} variant="status" status={item.status} />
              {item.genres.map(g => (
                <Badge key={g} label={g} variant="genre" />
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {item.title}
            </h1>
            {item.originalTitle && item.originalTitle !== item.title && (
              <p className="text-gray-600 dark:text-dark-muted mb-3">{item.originalTitle}</p>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-6 mb-4 flex-wrap">
              <Rating value={avgRating} count={item.ratingsCount} size="lg" />
              <span className="text-gray-600 dark:text-dark-muted text-sm">{item.year}</span>
              {item.episodes && (
                <span className="text-gray-600 dark:text-dark-muted text-sm">
                  {item.episodes} episodes
                </span>
              )}
              {item.duration && (
                <span className="text-gray-600 dark:text-dark-muted text-sm">{item.duration} min</span>
              )}
              {item.studio && (
                <span className="text-gray-600 dark:text-dark-muted text-sm">{item.studio}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-white/80 leading-relaxed mb-6 max-w-2xl">
              {item.synopsis}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {item.country && (
                <span className="bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-dark-muted text-xs px-2.5 py-1 rounded-full">
                  #{item.country}
                </span>
              )}
            </div>

            {/* List Management */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl max-w-sm">
                <LogIn className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <p className="text-gray-600 dark:text-dark-muted text-sm">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-brand-500 hover:underline"
                  >
                    Sign in
                  </button>
                  {' '}to add this to your list
                </p>
              </div>
            ) : !listEntry ? (
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Plus className="w-5 h-5" />}
                onClick={handleAddToList}
              >
                Add to List
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    ref={statusButtonRef}
                    onClick={() => setStatusDropdownOpen(p => !p)}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {statusLabels[listEntry.status]}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl z-20 min-w-[180px] overflow-hidden">
                      {(Object.keys(statusLabels) as WatchStatus[]).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={clsx(
                            'w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-dark-surface',
                            listEntry.status === status
                              ? 'text-brand-500 dark:text-brand-500 font-semibold bg-gray-50 dark:bg-dark-surface/50'
                              : 'text-gray-900 dark:text-white'
                          )}
                        >
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleRemoveFromList}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating & Review Form */}
      {isAuthenticated && listEntry && !reviewSubmitted && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Rate & Review
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setUserRating(n)}
                  className={clsx(
                    'text-2xl transition-transform hover:scale-110',
                    n <= userRating ? 'text-yellow-400' : 'text-gray-300 dark:text-dark-border'
                  )}
                >
                  ★
                </button>
              ))}
              {userRating > 0 && (
                <span className="ml-2 text-gray-900 dark:text-white font-semibold">
                  {userRating}/10
                </span>
              )}
            </div>

            {/* Review Text */}
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value.slice(0, 500))}
              placeholder="Write your review... (optional)"
              rows={4}
              className="w-full bg-gray-100 dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-500 resize-none text-sm"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-gray-600 dark:text-dark-muted text-xs">
                {reviewText.length}/500 characters
              </span>
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={userRating === 0}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Submitted Message */}
      {isAuthenticated && listEntry && reviewSubmitted && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 max-w-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-none">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">Review submitted!</p>
              <p className="text-gray-600 dark:text-dark-muted text-sm">
                You rated this {userRating}/10
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12 mt-16">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Reviews{' '}
          <span className="text-gray-600 dark:text-dark-muted font-normal text-base">
            ({titleReviews.length})
          </span>
        </h2>

        {titleReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-dark-muted">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl">
            {titleReviews.map(review => (
              <div
                key={review.id}
                className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatarUrl}
                      alt={review.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {review.username}
                      </p>
                      <p className="text-gray-600 dark:text-dark-muted text-xs">{review.createdAt}</p>
                    </div>
                  </div>
                  <Rating value={review.rating} size="sm" />
                </div>
                <p className="text-gray-700 dark:text-white/80 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TitlePage
