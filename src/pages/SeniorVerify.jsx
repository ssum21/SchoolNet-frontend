import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api/axios'
import '../styles/auth.css'

/**
 * 선배 인증 페이지 - 모던 스타일
 */
function SeniorVerify() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    graduationYear: '',
    verificationDocument: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const currentYear = new Date().getFullYear()
    const gradYear = parseInt(formData.graduationYear)

    // 졸업 연도 검증
    if (gradYear > currentYear) {
      setError('졸업 연도가 올바르지 않습니다.')
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post('/auth/verify-senior', {
        graduationYear: gradYear,
        verificationDocument: formData.verificationDocument
      })

      // 선배 인증 상태 업데이트
      localStorage.setItem('isSeniorVerified', 'true')

      navigate('/')
    } catch (error) {
      console.error('선배 인증 실패:', error)
      setError(error.response?.data?.message || '선배 인증에 실패했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* 브랜드 헤더 */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">🎓</span>
            <span className="auth-brand-text">SchoolNet</span>
          </Link>
          <h1 className="auth-title">선배 인증</h1>
          <p className="auth-subtitle">
            졸업생이신가요? 선배 인증을 완료하고 후배들에게 조언을 해주세요!
          </p>
        </div>

        {/* 혜택 안내 카드 */}
        <div className="auth-card card" style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>✨</span>
            선배 인증 혜택
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontSize: '20px' }}>🎖️</span>
              <span><strong>선배 뱃지</strong> 획득하고 신뢰도 UP!</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontSize: '20px' }}>💬</span>
              <span><strong>선배 전용 질문</strong>에 답변할 수 있어요</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontSize: '20px' }}>🌟</span>
              <span><strong>후배들에게 도움</strong>을 주고 보람을 느껴요</span>
            </li>
          </ul>
        </div>

        {/* 인증 폼 카드 */}
        <div className="auth-card card">
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">
                졸업 연도 <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <span className="input-icon">📅</span>
                <input
                  type="number"
                  className="auth-input"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="예: 2020"
                  min="2000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '6px'
              }}>
                해당 학교의 졸업 연도를 입력해주세요
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">
                인증 서류 (선택)
              </label>
              <div className="auth-input-wrapper">
                <span className="input-icon" style={{ top: '16px', alignSelf: 'flex-start' }}>📄</span>
                <textarea
                  className="auth-input"
                  value={formData.verificationDocument}
                  onChange={(e) => setFormData({ ...formData, verificationDocument: e.target.value })}
                  placeholder="졸업 증명서 번호 또는 기타 인증 정보를 입력하시면 빠르게 인증됩니다"
                  rows="4"
                  style={{
                    minHeight: '100px',
                    height: 'auto',
                    resize: 'vertical',
                    paddingTop: '14px'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  인증 중...
                </>
              ) : (
                <>
                  <span>🎓</span>
                  선배 인증하기
                </>
              )}
            </button>
          </form>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            나중에 인증하시겠어요?
          </p>
          <Link to="/" className="auth-footer-link">
            홈으로 돌아가기 →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SeniorVerify
