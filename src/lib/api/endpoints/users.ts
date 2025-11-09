/**
 * 사용자 관련 API 엔드포인트
 */
import apiClient from '../client'
import type { User } from '../types'

export const usersApi = {
  /**
   * 모든 사용자 조회
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/users')
    return response.data
  },

  /**
   * 특정 사용자 조회
   */
  getUserById: async (id: number | string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/users/${id}`)
    return response.data
  }
}
