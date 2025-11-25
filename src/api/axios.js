import axios from 'axios'

/**
 * 현재 환경에 맞는 API Base URL 자동 감지
 * - localhost에서 실행 시: http://localhost:8082
 * - 배포 환경: 현재 브라우저 호스트:8082
 */
const getApiBaseUrl = () => {
  // .env 파일에 명시적으로 설정된 경우 우선 사용
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // 브라우저 환경이 아닌 경우 (SSR 등)
  if (typeof window === 'undefined') {
    return 'http://localhost:8082'
  }

  const hostname = window.location.hostname
  const protocol = window.location.protocol

  // localhost 또는 127.0.0.1에서 실행 중인 경우 (개발 환경)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8082'
  }

  // 배포 환경: 현재 호스트에 백엔드 포트(8082) 사용
  return `${protocol}//${hostname}:8082`
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
