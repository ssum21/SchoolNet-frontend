/**
 * 인증 관련 API 엔드포인트
 */
import apiClient from '../client'
import type { LoginRequest, RegisterRequest, AuthResponse, SeniorVerifyRequest, User } from '../types'

export const authApi = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data)
    return response.data
  },

  /**
   * 회원가입 (학생증 OCR 인증)
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('username', data.username)
    formData.append('schoolName', data.schoolName)
    formData.append('studentCard', data.studentCard)

    const response = await apiClient.post<User>('/api/users/register-with-card', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * 선배 인증
   */
  verifySenior: async (data: SeniorVerifyRequest): Promise<void> => {
    await apiClient.post('/api/auth/verify-senior', data)
  }
}
