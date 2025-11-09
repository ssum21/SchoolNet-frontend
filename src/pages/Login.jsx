import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../lib/hooks'
import logo from '../assets/school_net_logo.png'
import '../styles/auth.css'

/**
 * 로그인 페이지 - 모던 스타일
 */
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const loginMutation = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    loginMutation.mutate(formData, {
      onError: (err) => {
        setError(err.message || '이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* 브랜드 헤더 */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <img src={logo} alt="SchoolNet" className="auth-brand-logo" />
          </Link>
          <h1 className="auth-title">로그인</h1>
          <p className="auth-subtitle">
            궁금한 것을 물어보고 선배들의 답변을 받아보세요
          </p>
        </div>

        {/* 로그인 폼 카드 */}
        <div className="auth-card card">
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">이메일</label>
              <div className="auth-input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  className="auth-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">비밀번호</label>
              <div className="auth-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="auth-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <span className="spinner-small"></span>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>
        </div>

        {/* 회원가입 링크 */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            아직 회원이 아니신가요?
          </p>
          <Link to="/register" className="auth-footer-link">
            회원가입하기 →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
