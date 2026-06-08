const SkeletonCard = () => (
  <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-gray-200 dark:border-dark-border animate-pulse">
    <div className="aspect-[2/3] bg-gray-100 dark:bg-dark-surface" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded w-1/2" />
    </div>
  </div>
)

export default SkeletonCard
