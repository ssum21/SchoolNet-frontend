import '../styles/badge.css'

/**
 * 선배 뱃지 컴포넌트
 * 선배 인증된 사용자에게 표시
 */
function SeniorBadge({ size = 'small' }) {
  return (
    <span className={`senior-badge senior-badge-${size}`}>
      <span className="badge-icon">🎓</span>
      <span className="badge-text">선배</span>
    </span>
  )
}

export default SeniorBadge
