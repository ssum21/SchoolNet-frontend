import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './styles/index.css'
import { useAuthStore } from './lib/store/auth'

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
})

// 앱 시작 시 localStorage에서 인증 정보 복원
const initializeAuth = () => {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  const userEmail = localStorage.getItem('userEmail')
  const isSenior = localStorage.getItem('isSeniorVerified') === 'true'
  const role = localStorage.getItem('userRole') || 'STUDENT'

  if (token && userId && userName) {
    useAuthStore.getState().setAuth(token, userId, userName, userEmail, isSenior, role)
  }
}

initializeAuth()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
