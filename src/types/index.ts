export type MediaType = 'movie' | 'series' | 'anime' | 'cartoon' | 'web-series'

export type MediaStatus = 'ongoing' | 'finished' | 'announced'

export type WatchStatus =
  | 'watching'
  | 'completed'
  | 'plan_to_watch'
  | 'dropped'
  | 'on_hold'

export interface Genre {
  id: string
  name: string
}

export interface MediaItem {
  id: string
  title: string
  originalTitle?: string
  type: MediaType
  genres: string[]
  year: number
  status: MediaStatus
  synopsis: string
  posterUrl: string
  bannerUrl?: string
  averageRating: number
  ratingsCount: number
  episodes?: number
  duration?: number
  country: string
  studio?: string
}

export interface FakeUser {
  id: string
  username: string
  avatarUrl: string
  joinedYear: number
  stats: {
    totalWatched: number
    totalEpisodes: number
    averageRating: number
    reviewsCount: number
    favoriteGenre: string
    favoriteType: MediaType
    byType: Record<MediaType, number>
  }
  recentActivity: {
    titleId: string
    status: WatchStatus
    rating?: number
  }[]
}

export interface UserListEntry {
  titleId: string
  status: WatchStatus
  userRating?: number
  review?: string
  addedAt: string
  updatedAt: string
}

export interface Review {
  id: string
  userId: string
  username: string
  avatarUrl: string
  titleId: string
  rating: number
  text: string
  createdAt: string
  likes: number
}

export interface AuthUser {
  id: string
  username: string
  avatarUrl: string
}
