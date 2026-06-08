import type { UserListEntry } from '../types'

export const countUserReviews = (list: UserListEntry[]): number =>
  list.filter(e => e.review?.trim()).length
