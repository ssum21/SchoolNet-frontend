import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import '../styles/home.css'

/**
 * 홈 페이지 - 동적 Reddit 스타일
 * 실시간 업데이트, 탭, 트렌딩 섹션
 */
function Home() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('hot') // hot, new, trending
  const [liveCount, setLiveCount] = useState(3) // 12명 중 3명 접속 중
  const [trendingTopics, setTrendingTopics] = useState([])

  useEffect(() => {
    fetchQuestions()
    fetchTrendingTopics()

    // 실시간 카운터 업데이트 (2~5명 왔다갔다)
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        const newValue = prev + change
        return newValue < 2 ? 2 : newValue > 5 ? 5 : newValue
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [activeTab])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      // 임시 데이터 (12명 유저 시나리오)
      const mockData = {
        hot: [
          {
            id: 1,
            title: '중학교 수학 문제 도와주세요 🔥',
            content: '이차방정식 푸는 방법을 모르겠어요. 근의 공식은 어떻게 사용하나요?',
            authorName: '김학생',
            categoryName: '수학',
            viewCount: 42,
            answerCount: 8,
            upvotes: 11,
            createdAt: '3시간 전',
            isHot: true
          },
          {
            id: 2,
            title: '친구관계 고민이 있어요',
            content: '요즘 친구들과 잘 지내는 방법이 궁금해요. 조언 부탁드려요!',
            authorName: '익명',
            categoryName: '친구관계',
            viewCount: 35,
            answerCount: 6,
            upvotes: 9,
            createdAt: '5시간 전',
            isHot: false
          },
          {
            id: 3,
            title: '영어 단어 암기 꿀팁 공유합니다',
            content: '제가 쓰던 영어 단어 암기법을 공유해요. 정말 효과적이에요!',
            authorName: '이선배',
            categoryName: '영어',
            viewCount: 28,
            answerCount: 5,
            upvotes: 12,
            createdAt: '7시간 전',
            isSenior: true
          }
        ],
        new: [
          {
            id: 4,
            title: '과학 실험 보고서 작성법 알려주세요',
            content: '내일까지 제출해야 하는데 어떻게 써야 할지 모르겠어요',
            authorName: '박학생',
            categoryName: '과학',
            viewCount: 3,
            answerCount: 0,
            upvotes: 1,
            createdAt: '2분 전',
            isNew: true
          },
          {
            id: 5,
            title: '체육대회 준비 어떻게 하나요?',
            content: '다음주에 체육대회가 있는데 준비할 게 뭐가 있을까요?',
            authorName: '최학생',
            categoryName: '학교생활',
            viewCount: 5,
            answerCount: 1,
            upvotes: 2,
            createdAt: '15분 전',
            isNew: true
          }
        ],
        trending: [
          {
            id: 6,
            title: '시험 기간 공부법 총정리 📚',
            content: '시험 기간에 효율적으로 공부하는 방법을 정리해봤어요',
            authorName: '정선배',
            categoryName: '공부법',
            viewCount: 56,
            answerCount: 10,
            upvotes: 12,
            createdAt: '1일 전',
            isTrending: true,
            isSenior: true
          }
        ]
      }

      setQuestions(mockData[activeTab] || mockData.hot)
      setLoading(false)
    } catch (error) {
      console.error('질문 로딩 실패:', error)
      setLoading(false)
    }
  }

  const fetchTrendingTopics = () => {
    // 12명 유저 기준 트렌드
    setTrendingTopics([
      { id: 1, name: '시험공부', count: 8, trend: 'up' },
      { id: 2, name: '친구관계', count: 6, trend: 'up' },
      { id: 3, name: '수학', count: 5, trend: 'same' },
      { id: 4, name: '영어단어', count: 4, trend: 'down' },
      { id: 5, name: '학교생활', count: 3, trend: 'up' }
    ])
  }

  const handleUpvote = (e, questionId) => {
    e.preventDefault()
    e.stopPropagation()
    // 업보트 로직 (실제로는 API 호출)
    console.log('Upvote:', questionId)
  }

  return (
    <div className="home-page">
      {/* 동적 히어로 배너 */}
      <div className="hero-banner">
        <div className="page-container">
          <div className="hero-content-flex">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="live-indicator"></span>
                <span>지금 <strong>{liveCount}명</strong>이 활동중</span>
              </div>
              <h1 className="hero-title-dynamic">
                욕설·악성글은 자동 차단 🎓
              </h1>
              <p className="hero-subtitle-dynamic">
                친구와 선배와 바로 소통하는 커뮤니티
              </p>
              <div className="hero-actions">
                <Link to="/questions/write" className="btn btn-primary btn-lg">
                  ✍️ 질문하기
                </Link>
                <Link to="/questions" className="btn btn-outline-white">
                  둘러보기
                </Link>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-box">
                <div className="stat-number">45</div>
                <div className="stat-label">전체 질문</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">58</div>
                <div className="stat-label">답변 수</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">12</div>
                <div className="stat-label">회원</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container home-content">
        <div className="content-grid">
          {/* 메인 피드 */}
          <div className="main-column">
            {/* 탭 네비게이션 */}
            <div className="feed-tabs card">
              <button
                className={`feed-tab ${activeTab === 'hot' ? 'active' : ''}`}
                onClick={() => setActiveTab('hot')}
              >
                <span className="tab-icon">🔥</span>
                <span className="tab-text">인기</span>
              </button>
              <button
                className={`feed-tab ${activeTab === 'new' ? 'active' : ''}`}
                onClick={() => setActiveTab('new')}
              >
                <span className="tab-icon">🆕</span>
                <span className="tab-text">최신</span>
              </button>
              <button
                className={`feed-tab ${activeTab === 'trending' ? 'active' : ''}`}
                onClick={() => setActiveTab('trending')}
              >
                <span className="tab-icon">📈</span>
                <span className="tab-text">트렌딩</span>
              </button>
            </div>

            {/* 질문 피드 */}
            {loading ? (
              <div className="loading-feed">
                <div className="spinner"></div>
                <p>질문을 불러오는 중...</p>
              </div>
            ) : (
              <div className="question-feed">
                {questions.map((question, index) => (
                  <article key={question.id} className="question-card-dynamic card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="question-vote">
                      <button
                        className="vote-btn vote-up"
                        onClick={(e) => handleUpvote(e, question.id)}
                      >
                        ▲
                      </button>
                      <span className="vote-count">{question.upvotes}</span>
                      <button className="vote-btn vote-down">▼</button>
                    </div>

                    <Link to={`/questions/${question.id}`} className="question-main">
                      <div className="question-header-dynamic">
                        <div className="question-badges-dynamic">
                          <span className="badge badge-category">{question.categoryName}</span>
                          {question.isHot && <span className="badge badge-hot">🔥 HOT</span>}
                          {question.isNew && <span className="badge badge-new">NEW</span>}
                          {question.isTrending && <span className="badge badge-trending">📈 인기급상승</span>}
                          {question.isSenior && <span className="badge badge-senior">🎓 선배</span>}
                        </div>
                        <span className="question-time-dynamic">{question.createdAt}</span>
                      </div>

                      <h3 className="question-title-dynamic">{question.title}</h3>
                      <p className="question-preview-dynamic">{question.content}</p>

                      <div className="question-footer-dynamic">
                        <span className="question-author-dynamic">
                          <span className="author-avatar">{question.authorName[0]}</span>
                          {question.authorName}
                        </span>
                        <div className="question-stats-dynamic">
                          <span className="stat">👁️ {question.viewCount}</span>
                          <span className="stat">💬 {question.answerCount}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <aside className="sidebar-column">
            {/* 트렌딩 토픽 */}
            <section className="sidebar-section">
              <div className="sidebar-card card">
                <h3 className="sidebar-card-title">
                  <span>📈</span>
                  실시간 트렌딩
                </h3>
                <div className="trending-list">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.id} className="trending-item">
                      <span className="trending-rank">{index + 1}</span>
                      <div className="trending-info">
                        <span className="trending-name">{topic.name}</span>
                        <span className="trending-count">{topic.count}개의 질문</span>
                      </div>
                      <span className={`trending-indicator trend-${topic.trend}`}>
                        {topic.trend === 'up' && '↑'}
                        {topic.trend === 'down' && '↓'}
                        {topic.trend === 'same' && '−'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 게시판 바로가기 */}
            <section className="sidebar-section">
              <div className="sidebar-card card">
                <h3 className="sidebar-card-title">
                  <span>📋</span>
                  게시판
                </h3>
                <div className="board-shortcuts">
                  <Link to="/board/talk" className="board-shortcut">
                    <span className="board-icon">💭</span>
                    <div className="board-info">
                      <span className="board-name">잡담게시판</span>
                      <span className="board-desc">자유롭게 대화</span>
                    </div>
                  </Link>
                  <Link to="/board/meeting" className="board-shortcut">
                    <span className="board-icon">🤝</span>
                    <div className="board-info">
                      <span className="board-name">모임게시판</span>
                      <span className="board-desc">모임 만들기</span>
                    </div>
                  </Link>
                  <Link to="/board/exam" className="board-shortcut">
                    <span className="board-icon">📝</span>
                    <div className="board-info">
                      <span className="board-name">족보게시판</span>
                      <span className="board-desc">시험자료 공유</span>
                    </div>
                  </Link>
                  <Link to="/questions" className="board-shortcut">
                    <span className="board-icon">💬</span>
                    <div className="board-info">
                      <span className="board-name">질문게시판</span>
                      <span className="board-desc">공부 질문하기</span>
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* 안내 */}
            <section className="sidebar-section">
              <div className="info-card-dynamic card">
                <h3 className="info-card-title-dynamic">
                  🛡️ 안전한 커뮤니티
                </h3>
                <ul className="info-list">
                  <li>✓ AI 자동 악플 차단</li>
                  <li>✓ 선배 인증 시스템</li>
                  <li>✓ 익명 질문 가능</li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <section className="sidebar-section">
              <div className="cta-card-dynamic card">
                <div className="cta-emoji">🎓</div>
                <h3 className="cta-title">선배이신가요?</h3>
                <p className="cta-text">후배들을 도와주세요!</p>
                <Link to="/senior-verify" className="btn btn-primary btn-sm">
                  선배 인증하기
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Home
