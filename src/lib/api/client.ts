/**
 * Axios API 클라이언트
 * 인터셉터, 에러 처리, 인증 포함
 */
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/auth'
import type { ApiError } from './types'

// Base URL 설정 - 배포 환경에서는 Nginx 프록시 사용
// 빌드 시점에는 빈 문자열, 런타임에 localhost면 8082 포트 사용
const BASE_URL = ''

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

// ============= 요청 인터셉터 =============
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 토큰 자동 첨부
    const token = useAuthStore.getState().token

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params
    })

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// ============= 응답 인터셉터 =============
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, {
      status: response.status,
      data: response.data
    })
    return response
  },
  (error: AxiosError<any>) => {
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    })

    // 401/403 처리 - 인증 실패
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('[API] Unauthorized - Clearing auth')
      useAuthStore.getState().clearAuth()

      // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인/회원가입이 아닌 경우)
      if (!window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }

    // 에러 객체 표준화
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.',
      status: error.response?.status,
      code: error.response?.data?.code || error.code,
      errors: error.response?.data?.errors
    }

    return Promise.reject(apiError)
  }
)

// ============= 유틸리티 함수 =============

/**
 * API 에러를 사용자 친화적 메시지로 변환
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error

  const apiError = error as ApiError

  // 필드 별 에러가 있는 경우
  if (apiError.errors) {
    const firstError = Object.values(apiError.errors)[0]
    return firstError?.[0] || apiError.message
  }

  // 상태 코드별 기본 메시지
  switch (apiError.status) {
    case 400:
      return '잘못된 요청입니다. 입력값을 확인해주세요.'
    case 401:
      return '로그인이 필요합니다.'
    case 403:
      return '권한이 없습니다.'
    case 404:
      return '요청한 리소스를 찾을 수 없습니다.'
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    default:
      return apiError.message || '오류가 발생했습니다.'
  }
}

export default apiClient
