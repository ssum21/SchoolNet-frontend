import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import '../styles/board.css'

/**
 * 통합 게시판 페이지
 * 족보/잡담/모임 게시판
 */
function Board() {
  const { type } = useParams() // exam, talk, meeting
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('latest')
  const [isSenior, setIsSenior] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const boardInfo = {
    exam: {
      name: '족보게시판',
      icon: '📝',
      desc: '시험 자료를 공유하고 함께 준비해요',
      canWrite: true, // 후배만 작성 가능
      color: '#3b82f6'
    },
    talk: {
      name: '잡담게시판',
      icon: '💭',
      desc: '자유롭게 이야기를 나눠요',
      canWrite: true,
      color: '#10b981'
    },
    meeting: {
      name: '모임게시판',
      icon: '🤝',
      desc: '스터디, 동아리 등 모임을 만들어요',
      canWrite: true,
      color: '#f59e0b'
    }
  }

  const currentBoard = boardInfo[type] || boardInfo.exam

  useEffect(() => {
    const token = localStorage.getItem('token')
    const seniorStatus = localStorage.getItem('isSeniorVerified')
    setIsLoggedIn(!!token)
    setIsSenior(seniorStatus === 'true')
    fetchPosts()
  }, [type, sortBy])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      // 임시 데이터
      const mockData = {
        exam: [
          {
            id: 1,
            title: '중간고사 수학 족보 공유합니다',
            content: '2학년 1학기 중간고사 수학 족보입니다. 많은 도움 되시길!',
            authorName: '김학생',
            viewCount: 234,
            commentCount: 15,
            likes: 42,
            createdAt: '2시간 전',
            hasFile: true
          },
          {
            id: 2,
            title: '영어 모의고사 기출문제',
            content: '최근 3년간 영어 모의고사 기출문제 모음입니다',
            authorName: '이학생',
            viewCount: 189,
            commentCount: 8,
            likes: 31,
            createdAt: '5시간 전',
            hasFile: true
          }
        ],
        talk: [
          {
            id: 3,
            title: '오늘 급식 어땠나요?',
            content: '오늘 치킨이 나왔는데 진짜 맛있었어요 ㅎㅎ',
            authorName: '박학생',
            viewCount: 156,
            commentCount: 23,
            likes: 18,
            createdAt: '30분 전'
          },
          {
            id: 4,
            title: '방학 때 뭐 하고 놀아요?',
            content: '방학 계획 공유해요!',
            authorName: '최학생',
            viewCount: 134,
            commentCount: 19,
            likes: 12,
            createdAt: '1시간 전'
          }
        ],
        meeting: [
          {
            id: 5,
            title: '수학 스터디 모집합니다 (2/4)',
            content: '중학교 2학년 수학 스터디 같이 하실 분 구합니다',
            authorName: '정학생',
            viewCount: 89,
            commentCount: 12,
            likes: 8,
            createdAt: '3시간 전',
            isMeeting: true
          }
        ]
      }

      setPosts(mockData[type] || mockData.exam)
      setLoading(false)
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
      setLoading(false)
    }
  }

  const canWrite = () => {
    // 선배는 글쓰기 불가
    return isLoggedIn && !isSenior
  }

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    if (isSenior) {
      alert('선배는 게시글을 작성할 수 없습니다. 후배들의 글에 답변만 가능합니다.')
      return
    }

    navigate(`/board/${type}/write`)
  }

  return (
    <div className="board-page">
      <div className="page-container page-narrow">
        {/* 게시판 헤더 */}
        <div className="board-header">
          <div className="board-title-section">
            <div className="board-icon-large" style={{ background: currentBoard.color }}>
              {currentBoard.icon}
            </div>
            <div>
              <h1 className="board-title">{currentBoard.name}</h1>
              <p className="board-description">{currentBoard.desc}</p>
            </div>
          </div>

          {canWrite() && (
            <button onClick={handleWriteClick} className="btn btn-primary btn-lg">
              <span>✍️</span>
              글쓰기
            </button>
          )}
        </div>

        {/* 선배 안내 메시지 */}
        {isSenior && (
          <div className="senior-notice">
            <span className="notice-icon">ℹ️</span>
            <div className="notice-content">
              <strong>선배님은 글 작성이 제한됩니다.</strong>
              <p>후배들의 게시글에 댓글로 도움을 주실 수 있습니다.</p>
            </div>
          </div>
        )}

        {/* 정렬 및 필터 */}
        <div className="board-filters card">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${sortBy === 'latest' ? 'active' : ''}`}
              onClick={() => setSortBy('latest')}
            >
              최신순
            </button>
            <button
              className={`filter-tab ${sortBy === 'popular' ? 'active' : ''}`}
              onClick={() => setSortBy('popular')}
            >
              인기순
            </button>
            <button
              className={`filter-tab ${sortBy === 'likes' ? 'active' : ''}`}
              onClick={() => setSortBy('likes')}
            >
              추천순
            </button>
          </div>
          <div className="post-count">
            전체 <strong>{posts.length}</strong>개
          </div>
        </div>

        {/* 게시글 목록 */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>게시글을 불러오는 중...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="post-list">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/board/${type}/${post.id}`}
                className="post-item card card-interactive"
              >
                <div className="post-header">
                  <h3 className="post-title">
                    {post.title}
                    {post.hasFile && <span className="file-badge">📎</span>}
                    {post.isMeeting && <span className="meeting-badge">모집중</span>}
                  </h3>
                  <span className="post-time">{post.createdAt}</span>
                </div>

                <p className="post-preview">{post.content}</p>

                <div className="post-footer">
                  <div className="post-author">
                    <span className="author-avatar">{post.authorName[0]}</span>
                    <span className="author-name">{post.authorName}</span>
                  </div>

                  <div className="post-stats">
                    <span className="stat">
                      <span className="stat-icon">👁️</span>
                      {post.viewCount}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">💬</span>
                      {post.commentCount}
                    </span>
                    <span className="stat stat-likes">
                      <span className="stat-icon">👍</span>
                      {post.likes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-icon">{currentBoard.icon}</div>
            <h3 className="empty-title">아직 게시글이 없어요</h3>
            <p className="empty-text">첫 번째 게시글을 작성해보세요!</p>
            {canWrite() && (
              <button onClick={handleWriteClick} className="btn btn-primary">
                글쓰기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Board
