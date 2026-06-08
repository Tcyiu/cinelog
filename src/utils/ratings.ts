import { fakeReviews } from '../data'
import type { MediaItem } from '../types'

const reviewsByTitleId = new Map<string, number[]>()

for (const review of fakeReviews) {
  const ratings = reviewsByTitleId.get(review.titleId) ?? []
  ratings.push(review.rating)
  reviewsByTitleId.set(review.titleId, ratings)
}

export const getCommunityRating = (titleId: string, baseRating: number): number => {
  const reviewRatings = reviewsByTitleId.get(titleId) ?? []
  const allRatings = [baseRating, ...reviewRatings]
  return allRatings.reduce((a, b) => a + b, 0) / allRatings.length
}

export const getItemCommunityRating = (item: MediaItem): number =>
  getCommunityRating(item.id, item.averageRating)
