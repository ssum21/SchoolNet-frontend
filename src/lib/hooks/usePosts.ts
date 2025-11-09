/**
 * 게시물 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi, getErrorMessage } from '../api'
import type { CreatePostRequest, Post } from '../api/types'

/**
 * 게시물 목록 조회 훅
 */
export const usePosts = (params?: {
  page?: number
  size?: number
  sort?: string
  categoryId?: number
  schoolId?: number
}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getAllPosts(params),
    staleTime: 1000 * 60 * 5 // 5분
  })
}

/**
 * 특정 게시물 조회 훅
 */
export const usePost = (id: number | string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id
  })
}

/**
 * 게시물 작성 훅
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: () => {
      // 게시물 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error('게시물 작성 실패:', error)
      alert(getErrorMessage(error))
    }
  })
}

/**
 * 게시물 좋아요 훅 (낙관적 업데이트)
 */
export const useLikePost = (postId: number | string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postsApi.likePost(postId),

    // 낙관적 업데이트
    onMutate: async () => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['posts', postId] })

      // 이전 데이터 백업
      const previousPost = queryClient.getQueryData<Post>(['posts', postId])

      // 낙관적으로 업데이트
      if (previousPost) {
        queryClient.setQueryData<Post>(['posts', postId], {
          ...previousPost,
          likes: (previousPost.likes || 0) + 1
        })
      }

      return { previousPost }
    },

    // 실패 시 롤백
    onError: (error, _, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['posts', postId], context.previousPost)
      }
      console.error('좋아요 실패:', error)
    },

    // 성공 시 서버 데이터로 갱신
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    }
  })
}

/**
 * 게시물 싫어요 훅 (낙관적 업데이트)
 */
export const useDislikePost = (postId: number | string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postsApi.dislikePost(postId),

    // 낙관적 업데이트
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId] })
      const previousPost = queryClient.getQueryData<Post>(['posts', postId])

      if (previousPost) {
        queryClient.setQueryData<Post>(['posts', postId], {
          ...previousPost,
          dislikes: (previousPost.dislikes || 0) + 1
        })
      }

      return { previousPost }
    },

    onError: (error, _, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['posts', postId], context.previousPost)
      }
      console.error('싫어요 실패:', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    }
  })
}
