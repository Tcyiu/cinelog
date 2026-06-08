const SkeletonList = () => (
  <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 flex gap-4 animate-pulse">
    <div className="w-16 h-24 bg-gray-100 dark:bg-dark-surface rounded-lg flex-none" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-4 bg-gray-100 dark:bg-dark-surface rounded w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded w-1/2" />
      <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded w-1/3" />
    </div>
  </div>
)

export default SkeletonList
