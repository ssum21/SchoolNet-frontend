import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../lib/hooks'
import logo from '../assets/school_net_logo.png'
import '../styles/auth.css'

/**
 * 회원가입 페이지 - 모던 스타일
 */
function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    username: '',
    schoolName: ''
  })
  const [studentCard, setStudentCard] = useState(null)
  const [error, setError] = useState('')

  const registerMutation = useRegister()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    if (!studentCard) {
      setError('학생증 이미지를 업로드해주세요.')
      return
    }

    registerMutation.mutate(
      {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        schoolName: formData.schoolName,
        studentCard
      },
      {
        onError: (err) => {
          setError(err.message || '회원가입에 실패했습니다.')
        }
      }
    )
  }

  // 비밀번호 강도 체크
  const getPasswordStrength = () => {
    const pwd = formData.password
    if (pwd.length === 0) return null
    if (pwd.length < 8) return { level: 'weak', text: '약함', color: '#dc2626' }
    if (pwd.length < 12) return { level: 'medium', text: '보통', color: '#f59e0b' }
    return { level: 'strong', text: '강함', color: '#059669' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-wide">
        {/* 브랜드 헤더 */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <img src={logo} alt="SchoolNet" className="auth-brand-logo" />
          </Link>
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-subtitle">
            SchoolNet에 가입하고 선배들과 소통해보세요
          </p>
        </div>

        {/* 회원가입 폼 카드 */}
        <div className="auth-card card">
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-label">이메일 <span className="required">*</span></label>
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
                <label className="auth-label">이름 <span className="required">*</span></label>
                <div className="auth-input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    className="auth-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">
                비밀번호 <span className="required">*</span>
                {passwordStrength && (
                  <span className="password-strength" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                )}
              </label>
              <div className="auth-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="auth-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="비밀번호 (8자 이상)"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">비밀번호 확인 <span className="required">*</span></label>
              <div className="auth-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="auth-input"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>
              {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                <div className="password-match-error">
                  ⚠️ 비밀번호가 일치하지 않습니다
                </div>
              )}
              {formData.passwordConfirm && formData.password === formData.passwordConfirm && (
                <div className="password-match-success">
                  ✅ 비밀번호가 일치합니다
                </div>
              )}
            </div>

            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-label">학교명 <span className="required">*</span></label>
                <div className="auth-input-wrapper">
                  <span className="input-icon">🏫</span>
                  <input
                    type="text"
                    className="auth-input"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="(예: 서울초등학교)"
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">학생증 업로드 <span className="required">*</span></label>
                <label className="auth-file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStudentCard(e.target.files?.[0] ?? null)}
                    required
                  />
                  <span className="file-upload-button">파일 선택</span>
                  <span className="file-upload-name">
                    {studentCard ? studentCard.name : '학생증 이미지를 업로드하세요'}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <span className="spinner-small"></span>
                  가입 중...
                </>
              ) : (
                '회원가입'
              )}
            </button>
          </form>
        </div>

        {/* 로그인 링크 */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            이미 회원이신가요?
          </p>
          <Link to="/login" className="auth-footer-link">
            로그인하기 →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
