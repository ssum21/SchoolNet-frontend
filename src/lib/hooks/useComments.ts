/**
 * 댓글 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi, getErrorMessage } from '../api'
import type { CreateCommentRequest, Comment } from '../api/types'

/**
 * 댓글 목록 조회 훅
 */
export const useComments = (params?: {
  postId?: number | string
  questionId?: number | string
}) => {
  return useQuery({
    queryKey: ['comments', params],
    queryFn: () => commentsApi.getAllComments(params),
    enabled: !!(params?.postId || params?.questionId)
  })
}

/**
 * 악플 조회 훅
 */
export const useBadComments = () => {
  return useQuery({
    queryKey: ['comments', 'bad'],
    queryFn: () => commentsApi.getBadComments()
  })
}

/**
 * 댓글 작성 훅
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentsApi.createComment(data),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 다시 불러오기
      const params = variables.postId
        ? { postId: variables.postId }
        : { questionId: variables.questionId }

      queryClient.invalidateQueries({ queryKey: ['comments', params] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
    onError: (error) => {
      console.error('댓글 작성 실패:', error)
      alert(getErrorMessage(error))
    }
  })
}

/**
 * 댓글 좋아요 훅 (낙관적 업데이트)
 */
export const useLikeComment = (commentId: number | string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => commentsApi.likeComment(commentId),

    // 낙관적 업데이트
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments'] })

      // 모든 댓글 쿼리에서 해당 댓글 찾아서 업데이트
      queryClient.setQueriesData<Comment[]>(
        { queryKey: ['comments'] },
        (old) => {
          if (!old) return old
          return old.map(comment =>
            comment.id === commentId
              ? { ...comment, likes: (comment.likes || 0) + 1 }
              : comment
          )
        }
      )
    },

    onError: (error) => {
      console.error('좋아요 실패:', error)
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  })
}

/**
 * 댓글 싫어요 훅 (낙관적 업데이트)
 */
export const useDislikeComment = (commentId: number | string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => commentsApi.dislikeComment(commentId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments'] })

      queryClient.setQueriesData<Comment[]>(
        { queryKey: ['comments'] },
        (old) => {
          if (!old) return old
          return old.map(comment =>
            comment.id === commentId
              ? { ...comment, dislikes: (comment.dislikes || 0) + 1 }
              : comment
          )
        }
      )
    },

    onError: (error) => {
      console.error('싫어요 실패:', error)
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  })
}
