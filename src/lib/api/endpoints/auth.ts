/**
 * 인증 관련 API 엔드포인트
 */
import apiClient from '../client'
import type { LoginRequest, RegisterRequest, AuthResponse, SeniorVerifyRequest } from '../types'

export const authApi = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data)
    return response.data
  },

  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users/register', data)
    return response.data
  },

  /**
   * 선배 인증
   */
  verifySenior: async (data: SeniorVerifyRequest): Promise<void> => {
    await apiClient.post('/api/auth/verify-senior', data)
  }
}
