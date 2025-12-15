import { Link } from 'react-router-dom'
import { useAuthStore } from '../lib/store/auth'
import { useLogout } from '../lib/hooks'
import logo from '../assets/school_net_logo.png'
import '../styles/navbar.css'

/**
 * 네비게이션 바 컴포넌트
 * Everytime/Reddit 스타일의 깔끔한 상단 네비게이션
 */
function Navbar() {
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated)
  const userName = useAuthStore((state) => state.userName)
  const isSenior = useAuthStore((state) => state.isSenior)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const handleLogout = useLogout()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="SchoolNet" className="brand-logo" />
        </Link>

        <div className="navbar-menu">
          <Link to="/board/talk" className="nav-item">
            <span className="nav-icon">💭</span>
            <span>잡담게시판</span>
          </Link>

          <Link to="/board/meeting" className="nav-item">
            <span className="nav-icon">🤝</span>
            <span>모임게시판</span>
          </Link>

          <Link to="/board/exam" className="nav-item">
            <span className="nav-icon">📝</span>
            <span>족보게시판</span>
          </Link>

          <Link to="/questions" className="nav-item">
            <span className="nav-icon">💬</span>
            <span>질문게시판</span>
          </Link>

          {isLoggedIn && !isSenior && (
            <Link to="/questions/write" className="nav-item nav-item-primary">
              <span className="nav-icon">✍️</span>
              <span>글쓰기</span>
            </Link>
          )}

          {isLoggedIn && isAdmin && (
            <Link to="/dashboard/bad-comments" className="nav-item nav-item-special">
              <span className="nav-icon">🛡️</span>
              <span>관리</span>
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                {isAdmin && <span className="admin-tag">관리자</span>}
                {isSenior && !isAdmin && <span className="senior-tag">선배</span>}
              </div>
              {!isSenior && (
                <Link to="/senior-verify" className="nav-btn nav-btn-outline">
                  선배인증
                </Link>
              )}
              <button onClick={handleLogout} className="nav-btn nav-btn-text">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-text">
                로그인
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
