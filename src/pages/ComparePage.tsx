import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { fakeUsers, mediaItems } from '../data'
import { getUserList } from '../utils/storage'
import { countUserReviews } from '../utils/userStats'
import usePageTitle from '../hooks/usePageTitle'

const CompareRow = ({
  label,
  myValue,
  theirValue,
  higherIsBetter = true,
}: {
  label: string
  myValue: number | string
  theirValue: number | string
  higherIsBetter?: boolean
}) => {
  const myNum = typeof myValue === 'number' ? myValue : null
  const theirNum = typeof theirValue === 'number' ? theirValue : null
  const myWins =
    myNum !== null && theirNum !== null && (higherIsBetter ? myNum > theirNum : myNum < theirNum)
  const theyWin =
    myNum !== null && theirNum !== null && (higherIsBetter ? theirNum > myNum : theirNum < myNum)

  return (
    <div className="grid grid-cols-3 items-center py-3 border-b border-gray-200 dark:border-dark-border last:border-0">
      <div
        className={clsx(
          'text-right pr-4 font-semibold',
          myWins ? 'text-brand-500' : 'text-gray-900 dark:text-white'
        )}
      >
        {typeof myValue === 'number' && myValue % 1 !== 0 ? myValue.toFixed(1) : myValue}
      </div>
      <div className="text-center text-gray-600 dark:text-dark-muted text-sm">{label}</div>
      <div
        className={clsx(
          'text-left pl-4 font-semibold',
          theyWin ? 'text-brand-500' : 'text-gray-900 dark:text-white'
        )}
      >
        {typeof theirValue === 'number' && theirValue % 1 !== 0 ? theirValue.toFixed(1) : theirValue}
      </div>
    </div>
  )
}

const ComparePage = () => {
  usePageTitle('Compare')

  const { user } = useAuth()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const selectedFakeUser = fakeUsers.find(u => u.id === selectedUserId) ?? null
  const userList = getUserList()

  const myStats = useMemo(() => {
    const completed = userList.filter(e => e.status === 'completed').length
    const typeCounts: Record<string, number> = {}
    userList.forEach(entry => {
      const item = mediaItems.find(m => m.id === entry.titleId)
      if (item) typeCounts[item.type] = (typeCounts[item.type] ?? 0) + 1
    })
    const genreCounts: Record<string, number> = {}
    userList
      .filter(e => e.status === 'completed')
      .forEach(entry => {
        const item = mediaItems.find(m => m.id === entry.titleId)
        item?.genres.forEach(g => {
          genreCounts[g] = (genreCounts[g] ?? 0) + 1
        })
      })
    const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    return {
      totalWatched: completed,
      totalInList: userList.length,
      reviewCount: countUserReviews(userList),
      favoriteGenre,
      stats: {
        movies: typeCounts['movie'] ?? 0,
        series: typeCounts['series'] ?? 0,
        anime: typeCounts['anime'] ?? 0,
        cartoons: typeCounts['cartoon'] ?? 0,
        webSeries: typeCounts['web-series'] ?? 0,
      },
    }
  }, [userList])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      <div className="bg-gray-50 dark:bg-dark-surface/30 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-7 h-7 text-brand-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare</h1>
          </div>
          <p className="text-gray-600 dark:text-dark-muted">See how your taste compares to other users</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-gray-600 dark:text-dark-muted text-sm mb-3">Select a user to compare with:</p>
        <div className="flex flex-wrap gap-3">
          {fakeUsers.map(fakeUser => (
            <button
              key={fakeUser.id}
              onClick={() => setSelectedUserId(fakeUser.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all',
                selectedUserId === fakeUser.id
                  ? 'border-brand-500 bg-brand-500/10 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-600 dark:text-dark-muted hover:border-brand-500/50 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <img src={fakeUser.avatarUrl} alt={fakeUser.username} className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium">{fakeUser.username}</span>
            </button>
          ))}
        </div>
      </div>

      {!selectedFakeUser && (
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Users className="w-16 h-16 text-gray-400 dark:text-dark-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Choose someone to compare with
          </h3>
          <p className="text-gray-600 dark:text-dark-muted">
            Select a user above to see a side-by-side comparison
          </p>
        </div>
      )}

      {selectedFakeUser && (
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-3 items-center mb-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <img
                src={user?.avatarUrl}
                alt={user?.username}
                className="w-16 h-16 rounded-full border-2 border-brand-500"
              />
              <p className="font-bold text-gray-900 dark:text-white">{user?.username}</p>
              <p className="text-gray-600 dark:text-dark-muted text-xs">You</p>
            </div>
            <div className="text-center text-gray-600 dark:text-dark-muted font-medium">VS</div>
            <div className="flex flex-col items-center gap-2 text-center">
              <img
                src={selectedFakeUser.avatarUrl}
                alt={selectedFakeUser.username}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-dark-border"
              />
              <p className="font-bold text-gray-900 dark:text-white">{selectedFakeUser.username}</p>
              <p className="text-gray-600 dark:text-dark-muted text-xs">
                Since {selectedFakeUser.joinedYear}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl px-6 mb-6">
            <CompareRow
              label="Completed"
              myValue={myStats.totalWatched}
              theirValue={selectedFakeUser.stats.totalWatched}
            />
            <CompareRow
              label="In List"
              myValue={myStats.totalInList}
              theirValue={selectedFakeUser.stats.totalWatched}
            />
            <CompareRow
              label="Reviews"
              myValue={myStats.reviewCount}
              theirValue={selectedFakeUser.stats.reviewsCount}
            />
            <CompareRow
              label="Fav Genre"
              myValue={myStats.favoriteGenre}
              theirValue={selectedFakeUser.stats.favoriteGenre}
              higherIsBetter={false}
            />
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">By Media Type</h3>
            <div className="space-y-4">
              {[
                {
                  label: 'Movies',
                  myVal: myStats.stats.movies,
                  theirVal: selectedFakeUser.stats.byType.movie,
                },
                {
                  label: 'Series',
                  myVal: myStats.stats.series,
                  theirVal: selectedFakeUser.stats.byType.series,
                },
                {
                  label: 'Anime',
                  myVal: myStats.stats.anime,
                  theirVal: selectedFakeUser.stats.byType.anime,
                },
                {
                  label: 'Cartoons',
                  myVal: myStats.stats.cartoons,
                  theirVal: selectedFakeUser.stats.byType.cartoon,
                },
                {
                  label: 'Web Series',
                  myVal: myStats.stats.webSeries,
                  theirVal: selectedFakeUser.stats.byType['web-series'],
                },
              ].map(({ label, myVal, theirVal }) => {
                const total = myVal + theirVal || 1
                const myPct = Math.round((myVal / total) * 100)
                const theirPct = 100 - myPct

                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-500 font-medium">{myVal}</span>
                      <span className="text-gray-600 dark:text-dark-muted">{label}</span>
                      <span className="text-gray-900 dark:text-white font-medium">{theirVal}</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-500 transition-all duration-500"
                        style={{ width: `${myPct}%` }}
                      />
                      <div className="bg-gray-100 dark:bg-dark-surface flex-1" />
                      <div
                        className="bg-gray-300 dark:bg-white/20 transition-all duration-500"
                        style={{ width: `${theirPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComparePage
