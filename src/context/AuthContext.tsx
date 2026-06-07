/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser } from '../types'
import { clearAuthUser, getAuthUser, setAuthUser } from '../utils/storage'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser())

  const value = useMemo<AuthContextValue>(() => {
    const login = (username: string, password: string): boolean => {
      const trimmedUsername = username.trim()

      if (!trimmedUsername || !password) {
        return false
      }

      const authUser: AuthUser = {
        id: 'auth-user',
        username: trimmedUsername,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${trimmedUsername}`,
      }

      setAuthUser(authUser)
      setUser(authUser)

      return true
    }

    const logout = (): void => {
      clearAuthUser()
      setUser(null)
    }

    return {
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
