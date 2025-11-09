import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api/axios'
import SeniorBadge from '../components/SeniorBadge'
import CommentForm from '../components/CommentForm'
import AIBotAnswer from '../components/AIBotAnswer'
import '../styles/questiondetail.css'

/**
 * 질문 상세 페이지 - Reddit 스타일
 * 질문 내용, 답변 목록, 답변 작성
 */
function QuestionDetail() {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [seniorMode, setSeniorMode] = useState(false)

  useEffect(() => {
    fetchQuestion()
    fetchAnswers()
  }, [id])

  const fetchQuestion = async () => {
    try {
      // 임시 데이터
      setQuestion({
        id: 1,
        title: '중학교 수학 문제 도와주세요',
        content: '이차방정식 푸는 방법을 모르겠어요. 근의 공식은 어떻게 사용하나요?\n\n특히 판별식이 뭔지 이해가 안 가요. 쉽게 설명해주실 수 있나요?',
        authorName: '김학생',
        isAuthorSenior: false,
        categoryName: '수학',
        viewCount: 234,
        answerCount: 12,
        isAnonymous: false,
        isForSeniorsOnly: false,
        createdAt: '2024-01-15T10:30:00'
      })
      setLoading(false)
    } catch (error) {
      console.error('질문 로딩 실패:', error)
      setLoading(false)
    }
  }

  const fetchAnswers = async () => {
    try {
      // 임시 데이터
      setAnswers([
        {
          id: 1,
          questionId: 1,
          userId: 2,
          authorName: '박선배',
          isSeniorAnswer: true,
          content: '이차방정식은 ax² + bx + c = 0 형태의 방정식이에요.\n\n근의 공식은 x = (-b ± √(b²-4ac)) / 2a 입니다.\n\n판별식 D = b²-4ac 값에 따라:\n- D > 0: 서로 다른 두 실근\n- D = 0: 중근\n- D < 0: 실근 없음 (허근)\n\n예를 들어 x² - 5x + 6 = 0 이면\na=1, b=-5, c=6\nD = 25 - 24 = 1 > 0 이므로 서로 다른 두 실근을 가져요!',
          helpfulCount: 15,
          createdAt: '2024-01-15T11:00:00'
        },
        {
          id: 2,
          questionId: 1,
          userId: 3,
          authorName: '이선배',
          isSeniorAnswer: true,
          content: '추가로 설명하자면, 근의 공식을 외우는 팁이 있어요!\n\n"음의 비 플마 루트 비제곱 마이너스 사에이씨 분의 투에이"\n이렇게 읊조리면서 외우면 좋아요 ㅎㅎ',
          helpfulCount: 8,
          createdAt: '2024-01-15T11:30:00'
        },
        {
          id: 3,
          questionId: 1,
          userId: 4,
          authorName: '최학생',
          isSeniorAnswer: false,
          content: '저도 이거 궁금했는데 감사합니다!',
          helpfulCount: 2,
          createdAt: '2024-01-15T12:00:00'
        }
      ])
    } catch (error) {
      console.error('답변 로딩 실패:', error)
    }
  }

  const handleAnswerSubmit = async (content) => {
    try {
      await axios.post('/answers', {
        questionId: id,
        content
      })
      fetchAnswers()
    } catch (error) {
      console.error('답변 작성 실패:', error)
      alert('답변 작성에 실패했습니다.')
    }
  }

  const handleHelpful = async (answerId) => {
    try {
      await axios.post(`/answers/${answerId}/helpful`)
      fetchAnswers()
    } catch (error) {
      console.error('도움됨 처리 실패:', error)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>질문을 불러오는 중...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="page-container page-narrow">
        <div className="empty-state card">
          <div className="empty-state-icon">😕</div>
          <h3 className="empty-state-title">질문을 찾을 수 없습니다</h3>
          <Link to="/questions" className="btn btn-primary">
            질문 목록으로
          </Link>
        </div>
      </div>
    )
  }

  const filteredAnswers = seniorMode
    ? answers.filter(answer => answer.isSeniorAnswer)
    : answers

  return (
    <div className="questiondetail-page">
      <div className="page-container page-narrow">
        {/* 상단 네비게이션 */}
        <div className="detail-breadcrumb">
          <Link to="/questions" className="breadcrumb-link">
            ← 질문 목록
          </Link>
        </div>

        {/* 질문 카드 */}
        <article className="question-detail-card card">
          <div className="question-detail-header">
            <div className="question-detail-badges">
              <span className="badge badge-gray">{question.categoryName}</span>
              {question.isForSeniorsOnly && (
                <span className="badge badge-primary">선배전용</span>
              )}
            </div>
            <div className="question-detail-meta">
              <span className="meta-item">
                <span className="meta-icon">👁️</span>
                {question.viewCount}
              </span>
              <span className="meta-item">
                <span className="meta-icon">💬</span>
                {answers.length}
              </span>
            </div>
          </div>

          <h1 className="question-detail-title">{question.title}</h1>

          <div className="question-detail-content">
            {question.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="question-detail-footer">
            <div className="question-detail-author">
              <div className="avatar avatar-sm">
                {question.authorName[0]}
              </div>
              <div className="author-info">
                <div className="author-name-wrapper">
                  <span className="author-name">{question.authorName}</span>
                  {question.isAuthorSenior && <SeniorBadge size="small" />}
                </div>
                <span className="author-time">
                  {new Date(question.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* 선배 전용 모드 */}
        {question.isForSeniorsOnly && (
          <div className="senior-mode-toggle">
            <button
              className={`toggle-btn ${seniorMode ? 'active' : ''}`}
              onClick={() => setSeniorMode(!seniorMode)}
            >
              <span className="toggle-icon">🎓</span>
              <span className="toggle-text">
                {seniorMode ? '전체 답변 보기' : '선배 답변만 보기'}
              </span>
            </button>
          </div>
        )}

        {/* AI 봇 답변 */}
        <AIBotAnswer questionId={id} />

        {/* 답변 섹션 */}
        <section className="answers-section">
          <div className="answers-header">
            <h2 className="answers-title">
              답변 <span className="answers-count">{filteredAnswers.length}</span>
            </h2>
          </div>

          {filteredAnswers.length > 0 ? (
            <div className="answers-list">
              {filteredAnswers.map(answer => (
                <article key={answer.id} className="answer-item card">
                  <div className="answer-content">
                    {answer.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  <div className="answer-footer">
                    <div className="answer-author">
                      <div className="avatar avatar-sm">
                        {answer.authorName[0]}
                      </div>
                      <div className="author-info">
                        <div className="author-name-wrapper">
                          <span className="author-name">{answer.authorName}</span>
                          {answer.isSeniorAnswer && <SeniorBadge size="small" />}
                        </div>
                        <span className="author-time">
                          {new Date(answer.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-helpful"
                      onClick={() => handleHelpful(answer.id)}
                    >
                      <span className="helpful-icon">❤️</span>
                      <span className="helpful-text">도움이 됐어요</span>
                      <span className="helpful-count">{answer.helpfulCount}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <div className="empty-state-icon">💬</div>
              <p className="empty-state-text">
                {seniorMode ? '아직 선배 답변이 없어요' : '아직 답변이 없어요'}
              </p>
            </div>
          )}
        </section>

        {/* 답변 작성 폼 */}
        <section className="answer-write-section">
          <h3 className="answer-write-title">답변 작성</h3>
          <CommentForm onSubmit={handleAnswerSubmit} />
        </section>
      </div>
    </div>
  )
}

export default QuestionDetail
