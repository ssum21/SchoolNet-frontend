/**
 * API 타입 정의
 * 백엔드 스키마에 맞춰 설계
 */

// ============= 기본 타입 =============
export interface User {
  id: number | string
  email?: string
  username?: string
  name?: string
  schoolId?: number
  grade?: number
  isSeniorVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export type PostBoardType = 'EXAM' | 'TALK' | 'MEETING' | 'QUESTION'

export interface Post {
  id: number | string
  title: string
  content: string
  authorId?: number | string
  authorName?: string
  categoryName?: string
  categoryId?: number
  viewCount?: number
  answerCount?: number
  commentCount?: number
  likes?: number
  dislikes?: number
  isAnonymous?: boolean
  isForSeniorsOnly?: boolean
  createdAt?: string
  updatedAt?: string
  boardType?: PostBoardType
  isBad?: boolean
}

export interface Comment {
  id: number | string
  postId: number | string
  questionId?: number | string
  content: string
  authorId?: number | string
  authorName?: string
  isSeniorAnswer?: boolean
  helpfulCount?: number
  likes?: number
  dislikes?: number
  createdAt?: string
  updatedAt?: string
}

// ============= 요청 타입 =============
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  schoolId: number
  grade: number
}

export interface CreatePostRequest {
  title: string
  content: string
  categoryId?: number
  isAnonymous?: boolean
  isForSeniorsOnly?: boolean
  boardType: PostBoardType
  meetingInfo?: {
    schedule: string
    location: string
    capacity?: number
  }
  questionInfo?: {
    categoryName: string
    isForSeniorsOnly: boolean
  }
}

export interface CreateCommentRequest {
  postId?: number | string
  questionId?: number | string
  content: string
}

export interface SeniorVerifyRequest {
  graduationYear: number
  verificationDocument?: string
}

// ============= 응답 타입 =============
export interface AuthResponse {
  token: string
  accessToken?: string
  userId: number | string
  name: string
  email?: string
  isSeniorVerified?: boolean
}

export interface LikesResponse {
  likes: number
  dislikes: number
  userLiked?: boolean
  userDisliked?: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements?: number
  totalPages?: number
  page?: number
  size?: number
}

// ============= API 에러 =============
export interface ApiError {
  message: string
  status?: number
  code?: string
  errors?: Record<string, string[]>
}

// ============= 유틸리티 타입 =============
export type SortBy = 'latest' | 'popular' | 'mostAnswered' | 'likes'
export type BoardType = 'exam' | 'talk' | 'meeting' | 'question'

// Question은 Post와 동일한 구조
export type Question = Post
export type Answer = Comment
