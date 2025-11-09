/**
 * 댓글 관련 API 엔드포인트
 */
import apiClient from '../client'
import type { Comment, CreateCommentRequest, LikesResponse } from '../types'

export const commentsApi = {
  /**
   * 댓글 전체 조회
   */
  getAllComments: async (params?: {
    postId?: number | string
    questionId?: number | string
  }): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>('/api/comments', { params })
    return response.data
  },

  /**
   * 악플 조회
   */
  getBadComments: async (): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>('/api/comments/bad')
    return response.data
  },

  /**
   * 댓글 작성
   */
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>('/api/comments', data)
    return response.data
  },

  /**
   * 댓글 좋아요
   */
  likeComment: async (id: number | string): Promise<LikesResponse> => {
    const response = await apiClient.post<LikesResponse>(`/api/comments/${id}/like`)
    return response.data
  },

  /**
   * 댓글 싫어요
   */
  dislikeComment: async (id: number | string): Promise<LikesResponse> => {
    const response = await apiClient.post<LikesResponse>(`/api/comments/${id}/dislike`)
    return response.data
  },

  /**
   * 댓글 좋아요/싫어요 수 조회
   */
  getCommentLikes: async (id: number | string): Promise<LikesResponse> => {
    const response = await apiClient.get<LikesResponse>(`/api/comments/${id}/likes`)
    return response.data
  }
}
