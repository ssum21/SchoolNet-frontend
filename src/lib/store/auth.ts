/**
 * 인증 상태 관리 (Zustand)
 * 토큰은 메모리에 저장 (보안)
 */
import { create } from 'zustand'

interface AuthState {
  token: string | null
  userId: string | number | null
  userName: string | null
  userEmail: string | null
  isSenior: boolean
  isAuthenticated: boolean

  setAuth: (token: string, userId: string | number, userName: string, email?: string, isSenior?: boolean) => void
  clearAuth: () => void
  updateSeniorStatus: (isSenior: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  userName: null,
  userEmail: null,
  isSenior: false,
  isAuthenticated: false,

  setAuth: (token, userId, userName, email, isSenior = false) => {
    set({
      token,
      userId,
      userName,
      userEmail: email,
      isSenior,
      isAuthenticated: true
    })

    // localStorage에도 저장 (새로고침 대응)
    localStorage.setItem('token', token)
    localStorage.setItem('userId', String(userId))
    localStorage.setItem('userName', userName)
    if (email) localStorage.setItem('userEmail', email)
    localStorage.setItem('isSeniorVerified', String(isSenior))
  },

  clearAuth: () => {
    set({
      token: null,
      userId: null,
      userName: null,
      userEmail: null,
      isSenior: false,
      isAuthenticated: false
    })

    // localStorage 클리어
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('isSeniorVerified')
  },

  updateSeniorStatus: (isSenior) => {
    set({ isSenior })
    localStorage.setItem('isSeniorVerified', String(isSenior))
  }
}))

// 앱 초기화 시 localStorage에서 복원
export const initializeAuth = () => {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  const userEmail = localStorage.getItem('userEmail')
  const isSenior = localStorage.getItem('isSeniorVerified') === 'true'

  if (token && userId && userName) {
    useAuthStore.getState().setAuth(token, userId, userName, userEmail || undefined, isSenior)
  }
}
