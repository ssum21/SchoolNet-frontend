/**
 * 게시물 관련 API 엔드포인트
 */
import apiClient from '../client'
import type { Post, CreatePostRequest, LikesResponse, PaginatedResponse, PostBoardType } from '../types'

export const postsApi = {
  /**
   * 게시물 전체 조회
   */
  getAllPosts: async (params?: {
    page?: number
    size?: number
    sort?: string
    categoryId?: number
    schoolId?: number
    boardType?: PostBoardType
  }): Promise<Post[]> => {
    const response = await apiClient.get<Post[] | PaginatedResponse<Post>>('/api/posts', { params })

    // 배열이면 그대로, 페이지네이션 객체면 content 추출
    if (Array.isArray(response.data)) {
      return response.data
    }
    return response.data.content || []
  },

  /**
   * 특정 게시물 조회
   */
  getPostById: async (id: number | string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/${id}`)
    return response.data
  },

  /**
   * 게시물 작성
   */
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Post>('/api/posts', data)
    return response.data
  },

  /**
   * 게시물 좋아요
   */
  likePost: async (id: number | string): Promise<LikesResponse> => {
    const response = await apiClient.post<LikesResponse>(`/api/posts/${id}/like`)
    return response.data
  },

  /**
   * 게시물 싫어요
   */
  dislikePost: async (id: number | string): Promise<LikesResponse> => {
    const response = await apiClient.post<LikesResponse>(`/api/posts/${id}/dislike`)
    return response.data
  },

  /**
   * 게시물 좋아요/싫어요 수 조회
   */
  getPostLikes: async (id: number | string): Promise<LikesResponse> => {
    const response = await apiClient.get<LikesResponse>(`/api/posts/${id}/likes`)
    return response.data
  }
}
