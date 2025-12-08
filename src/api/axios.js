import axios from 'axios'

// API Base URL 설정
const getApiBaseUrl = () => {
  // 환경 변수가 설정되어 있으면 사용
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  // 기본값: 현재 호스트의 8082 포트
  return `http://${window.location.hostname}:8082`
}

/**
 * Axios 인스턴스 설정
 * Base URL 및 인터셉터 설정
 */
const instance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000, // AI 답변 생성을 위해 60초로 증가
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - JWT 토큰 자동 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 리다이렉트
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
