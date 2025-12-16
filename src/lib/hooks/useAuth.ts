/**
 * 인증 관련 React Query 훅
 */
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi, getErrorMessage } from '../api'
import { useAuthStore } from '../store/auth'
import type { LoginRequest, RegisterRequest, SeniorVerifyRequest } from '../api/types'

/**
 * 로그인 훅
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // 토큰 저장
      const token = response.token || response.accessToken || ''
      // 백엔드 Java boolean getter 규칙으로 seniorVerified로 직렬화됨
      const isSenior = response.seniorVerified ?? response.isSeniorVerified ?? false
      setAuth(
        token,
        response.userId,
        response.username || response.name,
        response.email,
        isSenior,
        response.role || 'STUDENT'
      )

      // 홈으로 리다이렉트
      navigate('/')
    },
    onError: (error) => {
      console.error('로그인 실패:', error)
      alert(getErrorMessage(error))
    }
  })
}

/**
 * 회원가입 훅
 */
export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인 후 이용해주세요.')
      navigate('/login')
    },
    onError: (error) => {
      console.error('회원가입 실패:', error)
    }
  })
}

/**
 * 선배 인증 훅
 */
export const useSeniorVerify = () => {
  const navigate = useNavigate()
  const updateSeniorStatus = useAuthStore((state) => state.updateSeniorStatus)

  return useMutation({
    mutationFn: (data: SeniorVerifyRequest) => authApi.verifySenior(data),
    onSuccess: () => {
      updateSeniorStatus(true)
      alert('선배 인증이 완료되었습니다! 🎉')
      navigate('/')
    },
    onError: (error) => {
      console.error('선배 인증 실패:', error)
      alert(getErrorMessage(error))
    }
  })
}

/**
 * 로그아웃 훅
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return () => {
    clearAuth()
    navigate('/login')
  }
}
