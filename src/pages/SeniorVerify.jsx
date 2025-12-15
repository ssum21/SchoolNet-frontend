import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api/axios'
import '../styles/auth.css'

/**
 * 선배 인증 페이지 - 모던 스타일
 */
function SeniorVerify() {
  const navigate = useNavigate()
  const [studentIdImage, setStudentIdImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다.')
        return
      }

      // 이미지 파일 확인
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.')
        return
      }

      setStudentIdImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!studentIdImage) {
      setError('학생증 사진을 업로드해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('studentIdImage', studentIdImage)

      const response = await axios.post('/api/users/senior-verification/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // 선배 인증 상태 업데이트
      localStorage.setItem('isSeniorVerified', 'true')

      alert(response.data.data || '선배 인증이 완료되었습니다!')
      navigate('/')
    } catch (error) {
      console.error('선배 인증 실패:', error)
      setError(error.response?.data?.message || '선배 인증에 실패했습니다. 학생증 사진을 다시 확인해주세요.')
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
                학생증 사진 <span className="required">*</span>
              </label>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '12px',
                padding: '12px',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                lineHeight: '1.6'
              }}>
                📸 학생증 사진에서 <strong>입학년도를 자동으로 인식</strong>하여 선배 인증을 진행합니다.<br/>
                입학년도가 잘 보이도록 선명하게 촬영해주세요.
              </div>

              <input
                type="file"
                id="studentIdImage"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <label
                htmlFor="studentIdImage"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  border: '2px dashed var(--gray-300)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: previewUrl ? 'transparent' : 'var(--gray-50)'
                }}
                onMouseEnter={(e) => {
                  if (!previewUrl) e.currentTarget.style.borderColor = 'var(--primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gray-300)'
                }}
              >
                {previewUrl ? (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <img
                      src={previewUrl}
                      alt="학생증 미리보기"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '12px'
                      }}
                    />
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}>
                      📁 {studentIdImage?.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--primary)',
                      margin: '8px 0 0 0'
                    }}>
                      다른 사진을 선택하려면 클릭하세요
                    </p>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '48px', marginBottom: '12px' }}>📸</span>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0'
                    }}>
                      학생증 사진 업로드
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}>
                      클릭하여 파일 선택 또는 드래그 앤 드롭
                    </p>
                  </>
                )}
              </label>
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
