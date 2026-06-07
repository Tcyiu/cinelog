import type { AuthUser, UserListEntry } from '../types'

const KEYS = {
  AUTH: 'cinelog_auth',
  LIST: 'cinelog_list',
  THEME: 'cinelog_theme',
  REVIEWS: 'cinelog_reviews',
} as const

// Auth
export const getAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(KEYS.AUTH)

  return raw ? (JSON.parse(raw) as AuthUser) : null
}

export const setAuthUser = (user: AuthUser): void => {
  localStorage.setItem(KEYS.AUTH, JSON.stringify(user))
}

export const clearAuthUser = (): void => {
  localStorage.removeItem(KEYS.AUTH)
}

// User list
export const getUserList = (): UserListEntry[] => {
  const raw = localStorage.getItem(KEYS.LIST)

  return raw ? (JSON.parse(raw) as UserListEntry[]) : []
}

export const saveUserList = (list: UserListEntry[]): void => {
  localStorage.setItem(KEYS.LIST, JSON.stringify(list))
}

export const addOrUpdateEntry = (entry: UserListEntry): void => {
  const list = getUserList()
  const idx = list.findIndex((item) => item.titleId === entry.titleId)

  if (idx >= 0) {
    list[idx] = entry
  } else {
    list.push(entry)
  }

  saveUserList(list)
}

export const removeEntry = (titleId: string): void => {
  const list = getUserList().filter((item) => item.titleId !== titleId)

  saveUserList(list)
}

export const getEntryByTitleId = (
  titleId: string,
): UserListEntry | undefined => {
  return getUserList().find((item) => item.titleId === titleId)
}

// Theme
export const getTheme = (): 'dark' | 'light' => {
  return (localStorage.getItem(KEYS.THEME) as 'dark' | 'light') || 'dark'
}

export const setTheme = (theme: 'dark' | 'light'): void => {
  localStorage.setItem(KEYS.THEME, theme)
}
